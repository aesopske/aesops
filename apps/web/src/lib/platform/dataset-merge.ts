import 'server-only'
import { openDataset, type OpenableDoc } from './dataset-source'

function quoteIdent(name: string): string {
	return `"${name.replace(/"/g, '""')}"`
}

function csvCell(value: unknown): string {
	if (value === null || value === undefined) return ''
	const s = value instanceof Date ? value.toISOString() : String(value)
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function rowsToCsv(rows: Record<string, unknown>[], columns: string[]): string {
	const lines = [columns.map(csvCell).join(',')]
	for (const row of rows) {
		lines.push(columns.map((c) => csvCell(row[c])).join(','))
	}
	return lines.join('\n')
}

// Merges multiple versions of a dataset into a deduped CSV. Uses column
// intersection when schemas diverge (same approach as diffVersions).
export async function mergeDatasetAsCsv(
	rootDoc: OpenableDoc,
	allDocs: OpenableDoc[],
): Promise<string | null> {
	if (allDocs.length === 0) return null

	const datasets = await Promise.all(allDocs.map((doc) => openDataset(doc)))

	// Filter out any that failed to open (missing metadata)
	const opened = datasets
		.map((ds, i) => ({ ds, doc: allDocs[i]! }))
		.filter(({ ds }) => ds !== null) as Array<{ ds: Awaited<ReturnType<typeof openDataset>>; doc: OpenableDoc }>

	if (opened.length === 0) return null

	try {
		// Find common columns across all versions (column intersection)
		const columnSets = opened.map((o) => new Set(o.ds!.dq.columns.map((c) => c.name)))
		let common = Array.from(columnSets[0]!)
		for (let i = 1; i < columnSets.length; i++) {
			common = common.filter((c) => columnSets[i]!.has(c))
		}

		if (common.length === 0) return null

		const run = opened[0]!.ds!.dq.run
		const cols = common.map(quoteIdent).join(', ')
		const unionClauses = opened.map((o) => `SELECT ${cols} FROM ${o.ds!.dq.ref}`).join(' UNION ALL ')

		const rows = run(`SELECT DISTINCT * FROM (${unionClauses})`)

		return rowsToCsv(rows, common)
	} finally {
		opened.forEach(({ ds }) => ds!.release())
	}
}
