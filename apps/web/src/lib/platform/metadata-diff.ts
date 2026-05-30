import type { DocumentMetadata } from '@repo/db/schema'
import type { MetadataDiff } from '@repo/db/schema'

export function computeMetadataDiff(before: DocumentMetadata, after: DocumentMetadata): MetadataDiff {
    const beforeCols = new Map(before.columns.map((c) => [c.name, c]))
    const afterCols = new Map(after.columns.map((c) => [c.name, c]))

    const addedColumns = [...afterCols.keys()].filter((n) => !beforeCols.has(n))
    const removedColumns = [...beforeCols.keys()].filter((n) => !afterCols.has(n))

    const modifiedColumns: MetadataDiff['modifiedColumns'] = []

    for (const [name, afterCol] of afterCols) {
        const beforeCol = beforeCols.get(name)
        if (!beforeCol) continue

        const changes: { field: string; before: number | string; after: number | string }[] = []

        if (Math.abs(afterCol.nullPercent - beforeCol.nullPercent) > 1) {
            changes.push({ field: 'nullPercent', before: beforeCol.nullPercent, after: afterCol.nullPercent })
        }

        for (const stat of ['mean', 'min', 'max'] as const) {
            const b = beforeCol[stat]
            const a = afterCol[stat]
            if (b !== undefined && a !== undefined && b !== 0) {
                if (Math.abs(a - b) / Math.abs(b) > 0.05) {
                    changes.push({ field: stat, before: b, after: a })
                }
            }
        }

        const bTop = beforeCol.topValues?.[0]?.value
        const aTop = afterCol.topValues?.[0]?.value
        if (bTop !== undefined && aTop !== undefined && bTop !== aTop) {
            changes.push({ field: 'topValue', before: bTop, after: aTop })
        }

        if (changes.length > 0) modifiedColumns.push({ name, changes })
    }

    return {
        rowCountDelta: after.rowCount - before.rowCount,
        columnCountDelta: after.columnCount - before.columnCount,
        addedColumns,
        removedColumns,
        modifiedColumns,
    }
}
