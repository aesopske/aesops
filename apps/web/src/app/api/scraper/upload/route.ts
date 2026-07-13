import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata, MetadataDiff } from '@repo/db/schema'
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
    convertDocumentToParquet,
    generateAndSaveInsights,
    mergeDatasetVersions,
} from '@/lib/platform/dataset-pipeline'

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
            { error: `File must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes` },
            { status: 413 },
        )
    }

    const contentType = resolveContentType(file)
    if (!contentType) {
        return NextResponse.json(
            { error: `Unsupported file type. Allowed: ${ALLOWED_MIME.join(', ')}` },
            { status: 415 },
        )
    }

    const typedName = (form.get('name') as string | null)?.trim() ?? ''
    const description = (form.get('description') as string | null) ?? undefined
    const license = (form.get('license') as string | null) ?? null
    const source = (form.get('source') as string | null) ?? null
    const datasetSlug = (form.get('datasetSlug') as string | null)?.trim() || null
    const explicitParentId = (form.get('parentId') as string | null)?.trim() || null

    // Resolve the dataset this upload belongs to. A `datasetSlug` or `parentId`
    // targets an existing dataset (this becomes a new revision); resolve it to
    // the ROOT so revisions always chain off the original, never off another
    // revision. Absence of both means a brand-new root dataset.
    let parentId: string | null = null
    if (explicitParentId || datasetSlug) {
        const target = explicitParentId
            ? await documentService.getById(explicitParentId).catch(() => null)
            : await documentService.getBySlug(datasetSlug!).catch(() => null)
        if (!target) {
            return NextResponse.json(
                { error: 'Target dataset not found' },
                { status: 404 },
            )
        }
        parentId = target.parentId ?? target.id
    }

    const buffer = await file.arrayBuffer()
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
        const parent = await documentService.getById(parentId).catch(() => null)
        const revisions = await documentService.listRevisions(parentId)
        const versionNumber = revisions.length + 2
        const baseName = typedName.length > 0 ? stripExtension(typedName) : parent?.name ?? docName
        docName = `${baseName} v${versionNumber}`
        if (parent?.metadata) {
            metadataDiff = computeMetadataDiff(parent.metadata as DocumentMetadata, metadata)
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
    })

    // Derive the queryable Parquet substrate and the AI insights summary in
    // parallel (independent post-upload steps), then re-merge all versions so
    // the root's combined artifact includes this upload. All synchronous so
    // the caller knows the dataset is fully ready on a 200.
    const [parquet] = await Promise.all([
        convertDocumentToParquet(doc),
        generateAndSaveInsights(doc, docName, metadata),
    ])

    let mergedParquetKey: string | null = null
    if (parquet.ok) {
        const rootId = parentId ?? doc.id
        const root = await documentService.getById(rootId).catch(() => null)
        if (root) {
            const merged = await mergeDatasetVersions(root)
            if (merged.ok && 'parquetKey' in merged) mergedParquetKey = merged.parquetKey
        }
    }

    return NextResponse.json(
        {
            documentId: doc.id,
            slug: doc.slug,
            isRevision: !!parentId,
            parquetKey: parquet.ok ? parquet.parquetKey : null,
            mergedParquetKey,
        },
        { status: 201 },
    )
}
