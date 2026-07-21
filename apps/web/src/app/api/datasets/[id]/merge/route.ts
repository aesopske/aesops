import { type NextRequest, NextResponse } from 'next/server'
import { getVerifiedSession } from '@/lib/platform/session'
import { documentService } from '@repo/storage'
import { mergeDatasetVersions } from '@/lib/platform/dataset-pipeline'

export const maxDuration = 60

// Merges every version of a dataset into a single deduped Parquet artifact
// and records it on the root as `mergedParquetKey`. Fired (best-effort) by
// the client after a revision's own Parquet conversion succeeds.
//
// NOTE: `mergedParquetKey` is not currently read by the query path — queries
// against a dataset with revisions resolve to the latest revision's own
// Parquet instead (see `resolveQueryDoc` in dataset-source.ts), on the
// assumption that each revision is already a full cumulative snapshot. This
// merge pipeline is kept because it previously fed a "download merged
// dataset" UI that's since been removed; leaving it running (rather than
// deleting it) preserves the option to wire a consumer back up later.
export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params

    const session = await getVerifiedSession()
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
