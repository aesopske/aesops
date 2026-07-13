import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import { convertDocumentToParquet } from '@/lib/platform/dataset-pipeline'

export const maxDuration = 60

// Generates the derived Parquet artifact for a document and records its key.
// Fired (best-effort) by the client right after an upload is registered.
export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const doc = await documentService.getById(id).catch(() => null)
    if (!doc || doc.uploadedBy !== session.user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const result = await convertDocumentToParquet(doc)
    if (!result.ok) {
        const status = result.reason === 'no_columns' ? 422 : 500
        return NextResponse.json({ ok: false, reason: result.reason }, { status })
    }

    return NextResponse.json(result)
}
