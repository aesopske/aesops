import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { fileToParquet } from '@/lib/platform/parquet'

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

    if (doc.parquetKey) {
        return NextResponse.json({ ok: true, parquetKey: doc.parquetKey, skipped: true })
    }

    const meta = doc.metadata as DocumentMetadata | null
    if (!meta?.columns?.length) {
        return NextResponse.json({ error: 'No column metadata' }, { status: 422 })
    }

    try {
        const readUrl = await documentService.resolveReadUrl(doc)
        const res = await fetch(readUrl)
        if (!res.ok) throw new Error(`Failed to fetch source file (${res.status})`)
        const buffer = await res.arrayBuffer()

        const parquet = await fileToParquet(buffer, meta.columns)
        const key = `parquet/${doc.id}.parquet`
        await documentService.putObject(key, parquet, 'application/vnd.apache.parquet')
        await documentService.setParquetKey(doc.id, key)

        return NextResponse.json({ ok: true, parquetKey: key })
    } catch (err) {
        console.error(
            '[datasets/parquet] conversion failed for',
            id,
            err instanceof Error ? err.message : err,
        )
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
