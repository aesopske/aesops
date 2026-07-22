import { type NextRequest, NextResponse } from 'next/server'
import { getVerifiedSession } from '@/lib/platform/session'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { generateAndSaveInsights, generateAndSaveClassification } from '@/lib/platform/dataset-pipeline'

export async function POST(req: NextRequest) {
    const session = await getVerifiedSession()
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
    await generateAndSaveClassification(doc, docName, metadata)
    return NextResponse.json({ ok: true })
}
