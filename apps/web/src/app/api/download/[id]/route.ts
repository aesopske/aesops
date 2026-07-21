import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedSession } from '@/lib/platform/session'
import { documentService } from '@repo/storage'
import { db, datasetDownloads } from '@repo/db'

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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params

    const session = await getVerifiedSession()
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

    const doc = await documentService.getById(id)
    if (!doc) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await db
        .insert(datasetDownloads)
        .values({ documentId: doc.id, userId: session.user.id })
        .catch((err) => console.error('Failed to record dataset download', err))

    const url = await documentService.resolveDownloadUrl(doc)
    return NextResponse.redirect(url)
}
