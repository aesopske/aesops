import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { captureException } from '@sentry/core'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import { diffVersions } from '@/lib/platform/dataset-diff'
import { logger } from '@/lib/platform/logger'

const ROUTE = 'datasets/diff'

export const maxDuration = 60

// Best-effort, per-instance rate limit — mirrors the download route. A shared
// limiter (e.g. Upstash) is the follow-up once abuse is a real concern.
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 20
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

// Row-level diff between two versions of the same dataset. `[id]` is the newer
// (target) version; `?from=` is the older (base) version.
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id: toId } = await params
    const fromId = request.nextUrl.searchParams.get('from')
    if (!fromId) {
        return NextResponse.json({ error: 'Missing `from`' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (rateLimited(session.user.id)) {
        return NextResponse.json(
            { error: 'Too many diff requests. Please slow down.' },
            { status: 429 },
        )
    }

    const [from, to] = await Promise.all([
        documentService.getById(fromId).catch(() => null),
        documentService.getById(toId).catch(() => null),
    ])
    if (!from || !to) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Only versions of the same dataset may be diffed — the root is its own
    // series, revisions point at it via parentId.
    const fromRoot = from.parentId ?? from.id
    const toRoot = to.parentId ?? to.id
    if (fromRoot !== toRoot) {
        return NextResponse.json(
            { error: 'Versions belong to different datasets' },
            { status: 400 },
        )
    }

    try {
        const diff = await diffVersions(from, to)
        if (!diff) {
            return NextResponse.json(
                { error: 'Dataset has no column metadata to diff' },
                { status: 422 },
            )
        }
        return NextResponse.json(diff)
    } catch (err) {
        captureException(err, { tags: { route: ROUTE } })
        logger.error(ROUTE, err instanceof Error ? err.message : String(err), {
            from: fromId,
            to: toId,
        })
        return NextResponse.json({ error: 'Diff failed' }, { status: 500 })
    }
}
