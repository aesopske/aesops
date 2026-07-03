import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { captureException } from '@sentry/core'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { generateInsights } from '@/lib/platform/insights'
import { recordAiUsage } from '@/lib/platform/ai-usage'
import { logger } from '@/lib/platform/logger'

const ROUTE = 'ai/insights'
const MODEL = 'gemini-2.5-flash'

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentId, docName, metadata } = (await req.json()) as {
        documentId: string
        docName: string
        metadata: DocumentMetadata
    }

    const doc = await documentService.getById(documentId).catch(() => null)
    if (!doc || doc.uploadedBy !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const startedAt = Date.now()
    try {
        const { text, usage } = await generateInsights(docName, metadata, doc.description)
        await documentService.saveInsights(documentId, text)
        recordAiUsage({
            route: ROUTE,
            model: MODEL,
            userId: session.user.id,
            latencyMs: Date.now() - startedAt,
            success: true,
            usage,
        })
        return NextResponse.json({ ok: true })
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        captureException(err, { tags: { route: ROUTE } })
        logger.error(ROUTE, 'failed to generate insights', { docName, err: msg })
        recordAiUsage({
            route: ROUTE,
            model: MODEL,
            userId: session.user.id,
            latencyMs: Date.now() - startedAt,
            success: false,
            errorMessage: msg,
        })
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
