import 'server-only'
import { documentService } from '@repo/storage'
import type { ColumnStats, DocumentMetadata } from '@repo/db/schema'
import { mergeDatasetRows } from './dataset-merge'
import type { OpenableDoc } from './dataset-source'
import { rowsToParquet } from './parquet'

// Above this many merged rows, skip writing a merged Parquet rather than
// round-tripping a huge result set through the remote executor's JSON
// response and holding it all in memory here.
const MAX_MERGE_ROWS = 500_000

export type MergeDatasetToParquetResult =
	| { ok: true; parquetKey: string }
	| { ok: false; reason: 'no_rows' | 'too_large' }

// Merges every version of a dataset (root + revisions) into a single deduped
// Parquet file and records it as the root's `mergedParquetKey`. Best-effort:
// callers should treat failures as non-fatal (queries fall back to the root's
// own `parquetKey`).
export async function mergeDatasetToParquet(
	rootDoc: OpenableDoc & { id: string; metadata: unknown },
	allDocs: OpenableDoc[],
): Promise<MergeDatasetToParquetResult> {
	const merged = await mergeDatasetRows(allDocs)
	if (!merged || merged.rows.length === 0) return { ok: false, reason: 'no_rows' }
	if (merged.rows.length > MAX_MERGE_ROWS) return { ok: false, reason: 'too_large' }

	if (merged.droppedColumns.length > 0) {
		console.warn('[dataset-merge-parquet] dropped columns not common to all versions', {
			rootId: rootDoc.id,
			droppedColumns: merged.droppedColumns,
		})
	}

	const rootMeta = rootDoc.metadata as DocumentMetadata | null
	const columnsByName = new Map((rootMeta?.columns ?? []).map((c) => [c.name, c]))
	// Preserve the root's column order for anything present in both, falling
	// back to a generic string column for any merged column the root doesn't
	// know about (shouldn't normally happen since merge columns are an
	// intersection of all versions, which includes the root).
	const columns: ColumnStats[] = merged.columns.map(
		(name) =>
			columnsByName.get(name) ?? {
				name,
				dtype: 'string',
				nullCount: 0,
				nullPercent: 0,
				uniqueCount: 0,
			},
	)

	const buffer = await rowsToParquet(merged.rows, columns)
	const key = `parquet/merged/${rootDoc.id}.parquet`
	await documentService.putObject(key, buffer, 'application/vnd.apache.parquet')
	await documentService.setMergedParquetKey(rootDoc.id, key)

	return { ok: true, parquetKey: key }
}
