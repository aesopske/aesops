import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { generateAndSaveInsights } from '@/lib/platform/dataset-pipeline'

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

    await generateAndSaveInsights(doc, docName, metadata)
    return NextResponse.json({ ok: true })
}
