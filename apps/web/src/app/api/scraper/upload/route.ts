import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata, MetadataDiff } from '@repo/db/schema'
import { captureException, captureMessage } from '@sentry/core'
import { extractMetadata } from '@/lib/platform/metadata'
import { computeMetadataDiff } from '@/lib/platform/metadata-diff'
import {
    ALLOWED_MIME,
    MAX_UPLOAD_BYTES,
    isAllowedMime,
    safeKeySegment,
    stripExtension,
    type AllowedMime,
} from '@/lib/platform/document-naming'
import {
    checkForAnomaly,
    convertDocumentToParquet,
    generateAndSaveInsights,
    generateAndSaveClassification,
    mergeDatasetVersions,
} from '@/lib/platform/dataset-pipeline'

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

export const maxDuration = 60

const CONTENT_TYPE_BY_EXT: Record<string, AllowedMime> = {
    csv: 'text/csv',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

// curl and other non-browser clients report inconsistent (or `octet-stream`)
// MIME types for CSV/Excel, so trust the file's own MIME only when it's one we
// accept, otherwise derive it from the extension — mirrors the browser upload.
function resolveContentType(file: File): AllowedMime | null {
    if (isAllowedMime(file.type)) return file.type
    const ext = file.name.toLowerCase().split('.').pop() ?? ''
    return CONTENT_TYPE_BY_EXT[ext] ?? null
}

function readApiKey(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization')
    if (authHeader?.toLowerCase().startsWith('bearer ')) {
        return authHeader.slice(7).trim() || null
    }
    return req.headers.get('x-api-key')?.trim() || null
}

// Programmatic dataset upload for automated scraper scripts. Authenticated with
// a Better Auth API key (scope `datasets: ['write']`) rather than a browser
// session, and performs the whole ingestion pipeline in one synchronous pass:
// store → extract metadata → persist → derive Parquet → merge revisions.
export async function POST(req: NextRequest) {
    const key = readApiKey(req)
    if (!key) {
        return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
    }

    const verified = await auth.api
        .verifyApiKey({ body: { key, permissions: { datasets: ['write'] } } })
        .catch(() => null)
    if (!verified?.valid || !verified.key) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }
    const userId = verified.key.referenceId

    let form: FormData
    try {
        form = await req.formData()
    } catch {
        return NextResponse.json(
            { error: 'Expected multipart/form-data' },
            { status: 400 },
        )
    }

    const file = form.get('file')
    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Missing `file`' }, { status: 400 })
    }
    if (file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json(
            {
                error: `File must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes`,
            },
            { status: 413 },
        )
    }

    const contentType = resolveContentType(file)
    if (!contentType) {
        return NextResponse.json(
            {
                error: `Unsupported file type. Allowed: ${ALLOWED_MIME.join(', ')}`,
            },
            { status: 415 },
        )
    }

    const typedName = (form.get('name') as string | null)?.trim() ?? ''
    const description = (form.get('description') as string | null) ?? undefined
    const license = (form.get('license') as string | null) ?? null
    const source = (form.get('source') as string | null) ?? null
    const datasetSlug =
        (form.get('datasetSlug') as string | null)?.trim() || null
    const explicitParentId =
        (form.get('parentId') as string | null)?.trim() || null

    // Resolve the dataset this upload belongs to. A `datasetSlug` or `parentId`
    // targets an existing dataset (this becomes a new revision); resolve it to
    // the ROOT so revisions always chain off the original, never off another
    // revision. Absence of both means a brand-new root dataset.
    let parentId: string | null = null
    let newRootSlug: string | undefined
    if (explicitParentId || datasetSlug) {
        const target = explicitParentId
            ? await documentService.getById(explicitParentId).catch(() => null)
            : await documentService.getBySlug(datasetSlug!).catch(() => null)
        if (target) {
            parentId = target.parentId ?? target.id
        } else if (explicitParentId) {
            // A stale/incorrect parentId is a real bug worth surfacing —
            // unlike datasetSlug (see below), there's no "first run" case
            // where an explicit id is expected not to exist yet.
            return NextResponse.json(
                { error: 'Target dataset not found' },
                { status: 404 },
            )
        } else {
            // No dataset with this slug yet — likely the scraper's first run
            // (it always passes --dataset-slug). Create a new root under the
            // requested slug instead of erroring, so later runs find it.
            newRootSlug = datasetSlug!
        }
    }

    const buffer = await file.arrayBuffer()
    const contentHash = await sha256Hex(buffer)

    // Resolve the revision this upload would chain off of (before any parsing
    // or storage work), so an unchanged re-upload can short-circuit cheaply.
    let parent: Awaited<ReturnType<typeof documentService.getById>> | undefined
    let revisions: Awaited<ReturnType<typeof documentService.listRevisions>> = []
    let baseline: (typeof revisions)[number] | typeof parent
    if (parentId) {
        parent = await documentService.getById(parentId).catch(() => undefined)
        revisions = await documentService.listRevisions(parentId)
        // Diff against the latest existing revision (or the root if this is
        // the first revision) — not always the root — so the delta reflects
        // only what changed in this upload, not the cumulative change since v1.
        baseline = revisions.at(-1) ?? parent
    }

    if (baseline && baseline.contentHash === contentHash) {
        await documentService.recordUnchangedCheck(baseline.id)
        return NextResponse.json({
            documentId: baseline.id,
            slug: baseline.slug,
            isRevision: true,
            unchanged: true,
            reviewStatus: 'active',
        })
    }

    let metadata: DocumentMetadata
    try {
        metadata = extractMetadata(buffer)
    } catch (err) {
        return NextResponse.json(
            {
                error: 'Could not parse file',
                detail: err instanceof Error ? err.message : String(err),
            },
            { status: 422 },
        )
    }

    // Name reflects intent: an explicit `name`, else the parent's locked name
    // for a revision, else the raw filename. Revisions get a ` vN` suffix.
    let docName = stripExtension(typedName.length > 0 ? typedName : file.name)
    let metadataDiff: MetadataDiff | null = null
    if (parentId) {
        const versionNumber = revisions.length + 2
        const baseName =
            typedName.length > 0
                ? stripExtension(typedName)
                : (parent?.name ?? docName)
        docName = `${baseName} v${versionNumber}`
        if (baseline?.metadata) {
            metadataDiff = computeMetadataDiff(
                baseline.metadata as DocumentMetadata,
                metadata,
            )
        }
    }

    const storageKey = `datasets/${userId}/${crypto.randomUUID()}/${safeKeySegment(file.name)}`
    const { objectUrl } = await documentService.putObject(
        storageKey,
        new Uint8Array(buffer),
        contentType,
    )

    const doc = await documentService.create({
        name: docName,
        url: objectUrl,
        storageKey,
        size: file.size,
        mimeType: contentType,
        provider: 'r2',
        uploadedBy: userId,
        metadata,
        description,
        license,
        source,
        parentId,
        metadataDiff,
        slug: newRootSlug,
        contentHash,
    })

    // Derive the queryable Parquet substrate and the AI insights summary in
    // parallel (independent post-upload steps), then re-merge all versions so
    // the root's combined artifact includes this upload. All synchronous so
    // the caller knows the dataset is fully ready on a 200.
    const [parquet] = await Promise.all([
        convertDocumentToParquet(doc),
        generateAndSaveInsights(doc, docName, metadata).then(() =>
            generateAndSaveClassification(doc, docName, metadata),
        ),
    ])

    // Compare against the previous version's row count to catch a source that
    // silently stopped sending a full snapshot — flagged revisions are held
    // out of the query path (see resolveQueryDoc) and out of the merge below,
    // rather than being served as the new current state.
    let reviewStatus: 'active' | 'pending_review' = 'active'
    let anomaly: Awaited<ReturnType<typeof checkForAnomaly>> = null
    if (parquet.ok && parentId && baseline) {
        try {
            // doc.parquetKey is stale (still null from before conversion) —
            // pass the real one so openDataset doesn't hit its racy
            // on-the-fly reconversion fallback.
            anomaly = await checkForAnomaly(baseline, { ...doc, parquetKey: parquet.parquetKey })
        } catch (err) {
            // The check itself couldn't run (e.g. the remote DuckDB executor
            // errored, even after checkForAnomaly's own retry) — hold for
            // review rather than silently treating an unverifiable upload as
            // safe. An upload that can't be checked is exactly the case this
            // feature exists to catch, not a reason to skip it.
            captureException(err, { tags: { route: 'scraper/upload' } })
            anomaly = {
                reason: 'check_failed',
                previousDocId: baseline.id,
                error: err instanceof Error ? err.message : String(err),
                detectedAt: new Date().toISOString(),
            }
        }
        if (anomaly) {
            await documentService.flagForReview(doc.id, anomaly)
            reviewStatus = 'pending_review'
            captureMessage(
                anomaly.reason === 'check_failed'
                    ? 'Dataset upload held for review: anomaly check failed'
                    : 'Dataset upload flagged as anomalous',
                {
                    level: 'warning',
                    tags: { route: 'scraper/upload', datasetId: parentId },
                    extra: anomaly,
                },
            )
        }
    }

    let mergedParquetKey: string | null = null
    if (parquet.ok && reviewStatus === 'active') {
        const rootId = parentId ?? doc.id
        const root = await documentService.getById(rootId).catch(() => null)
        if (root) {
            const merged = await mergeDatasetVersions(root)
            if (merged.ok && 'parquetKey' in merged)
                mergedParquetKey = merged.parquetKey
        }
    }

    return NextResponse.json(
        {
            documentId: doc.id,
            slug: doc.slug,
            isRevision: !!parentId,
            unchanged: false,
            reviewStatus,
            ...(anomaly ? { anomaly } : {}),
            parquetKey: parquet.ok ? parquet.parquetKey : null,
            mergedParquetKey,
        },
        { status: 201 },
    )
}
