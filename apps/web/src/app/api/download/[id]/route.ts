import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import { mergeDatasetAsCsv } from '@/lib/platform/dataset-merge'

// Best-effort, per-instance rate limit. Serverless runs many instances so this
// is a soft guard, not a hard cap — a shared limiter (e.g. Upstash) is the
// follow-up once download abuse is a real concern.
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 30
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(userId: string): boolean {
    const now = Date.now()
    const entry = hits.get(userId)
    if (!entry || now > entry.resetAt) {
        hits.set(userId, { count: 1, resetAt: now + WINDOW_MS })
        return false
    }
    entry.count += 1
    return entry.count > MAX_PER_WINDOW
}

// Resolves a version parameter to a document ID or special sentinel.
// version=latest → root doc ID
// version=1,2,3... → nth revision (1-indexed, where 1 is root)
// version=merged → special sentinel for merge path
async function resolveVersionId(
    rootId: string,
    versionParam: string,
): Promise<{ type: 'doc'; id: string } | { type: 'merged'; ids: string[] } | null> {
    if (versionParam === 'latest') {
        return { type: 'doc', id: rootId }
    }

    if (versionParam === 'merged') {
        const root = await documentService.getById(rootId)
        if (!root) return null

        // Gather root + all revisions
        const revisions = await documentService.listRevisions(rootId)
        const allIds = [rootId, ...revisions.map((r) => r.id)]
        return { type: 'merged', ids: allIds }
    }

    // Try parsing as version number (1, 2, 3, etc.)
    const versionNum = parseInt(versionParam, 10)
    if (!Number.isNaN(versionNum) && versionNum >= 1) {
        const root = await documentService.getById(rootId)
        if (!root) return null

        if (versionNum === 1) {
            return { type: 'doc', id: rootId }
        }

        const revisions = await documentService.listRevisions(rootId)
        const revision = revisions[versionNum - 2]
        if (!revision) return null

        return { type: 'doc', id: revision.id }
    }

    return null
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params
    const versionParam = request.nextUrl.searchParams.get('version') || 'latest'

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        const signIn = new URL(`/sign-in`, request.url)
        signIn.searchParams.set('from', `/datasets/${id}`)
        return NextResponse.redirect(signIn)
    }

    if (rateLimited(session.user.id)) {
        return NextResponse.json(
            { error: 'Too many download requests. Please slow down.' },
            { status: 429 },
        )
    }

    const root = await documentService.getById(id)
    if (!root) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const resolved = await resolveVersionId(id, versionParam)
    if (!resolved) {
        return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Handle merged version: generate and stream a deduped CSV
    if (resolved.type === 'merged') {
        const docs = await Promise.all(resolved.ids.map((docId) => documentService.getById(docId)))
        const validDocs = docs.filter((d): d is NonNullable<typeof d> => d !== null && d !== undefined)

        if (validDocs.length === 0) {
            return NextResponse.json({ error: 'No versions found' }, { status: 404 })
        }

        const csv = await mergeDatasetAsCsv(
            {
                provider: validDocs[0]!.provider,
                storageKey: validDocs[0]!.storageKey,
                url: validDocs[0]!.url,
                parquetKey: validDocs[0]!.parquetKey,
                metadata: validDocs[0]!.metadata,
            },
            validDocs.map((d) => ({
                provider: d.provider,
                storageKey: d.storageKey,
                url: d.url,
                parquetKey: d.parquetKey,
                metadata: d.metadata,
            })),
        )

        if (!csv) {
            return NextResponse.json({ error: 'Unable to merge versions' }, { status: 422 })
        }

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${root.name}-merged.csv"`,
            },
        })
    }

    // Handle single version: redirect to signed URL
    const doc = await documentService.getById(resolved.id)
    if (!doc) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const url = await documentService.resolveDownloadUrl(doc)
    return NextResponse.redirect(url)
}
