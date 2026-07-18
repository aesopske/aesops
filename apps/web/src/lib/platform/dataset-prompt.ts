import type { DocumentMetadata } from '@repo/db/schema'

// Per-column stats line, e.g.
//   - Price (numeric) · 2.5% null · mean=10, min=1, max=99 · top values: "5" (12), ...
export function formatColumnSummary(columns: DocumentMetadata['columns']): string {
    return columns
        .map((col) => {
            const parts = [`  - ${col.name} (${col.dtype})`]
            if (col.nullPercent > 0)
                parts.push(`${col.nullPercent.toFixed(1)}% null`)
            if (col.mean !== undefined)
                parts.push(`mean=${col.mean}, min=${col.min}, max=${col.max}`)
            else if (col.min !== undefined && col.max !== undefined)
                parts.push(`min=${col.min}, max=${col.max}`)
            if (col.topValues?.length) {
                const top = col.topValues
                    .slice(0, 3)
                    .map((v) => `"${v.value}" (${v.count})`)
                    .join(', ')
                parts.push(`top values: ${top}`)
            }
            return parts.join(' · ')
        })
        .join('\n')
}

// Pretty-printed JSON of the first `limit` sample rows, or "Not available".
export function formatSampleRows(
    sampleRows: DocumentMetadata['sampleRows'],
    limit = 5,
): string {
    return sampleRows?.length
        ? JSON.stringify(sampleRows.slice(0, limit), null, 2)
        : 'Not available'
}

// The dataset context block shared by the chat prompt: name, shape, per-column
// stats, and a few sample rows.
export function buildDatasetContextBlock(opts: {
    name: string
    meta: DocumentMetadata
    sampleLimit?: number
}): string {
    const { name, meta, sampleLimit = 5 } = opts
    return `Dataset: ${name}
Rows: ${meta.rowCount.toLocaleString()} | Columns: ${meta.columnCount}${meta.analyzedSheet ? ` | Sheet: ${meta.analyzedSheet}` : ''}

Columns:
${formatColumnSummary(meta.columns)}

Sample data (first ${meta.sampleRows?.length ?? 0} rows):
${formatSampleRows(meta.sampleRows, sampleLimit)}`
}
