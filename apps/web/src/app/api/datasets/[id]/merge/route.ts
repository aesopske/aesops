import { type NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import { mergeDatasetVersions } from '@/lib/platform/dataset-pipeline'

export const maxDuration = 60

// Merges every version of a dataset into a single deduped Parquet artifact
// and records it on the root as `mergedParquetKey`. Fired (best-effort) by
// the client after a revision's own Parquet conversion succeeds.
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

    const root = doc.parentId ? await documentService.getById(doc.parentId) : doc
    if (!root) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const result = await mergeDatasetVersions(root)
    return NextResponse.json(result)
}
