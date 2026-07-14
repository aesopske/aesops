import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// Historical `metadata_diff` rows were computed against the dataset ROOT for
// every revision, instead of the immediately preceding version — so the badge
// showed the cumulative change since v1, not the delta for that upload alone
// (e.g. a v3 badge reading "+1,561 rows" when v2→v3 only actually added 892).
// This recomputes metadata_diff for every existing revision against its true
// baseline (the previous revision, or the root if it's the first revision).

function computeMetadataDiff(before, after) {
    const beforeCols = new Map(before.columns.map((c) => [c.name, c]))
    const afterCols = new Map(after.columns.map((c) => [c.name, c]))

    const addedColumns = [...afterCols.keys()].filter((n) => !beforeCols.has(n))
    const removedColumns = [...beforeCols.keys()].filter((n) => !afterCols.has(n))

    const modifiedColumns = []

    for (const [name, afterCol] of afterCols) {
        const beforeCol = beforeCols.get(name)
        if (!beforeCol) continue

        const changes = []

        if (Math.abs(afterCol.nullPercent - beforeCol.nullPercent) > 1) {
            changes.push({ field: 'nullPercent', before: beforeCol.nullPercent, after: afterCol.nullPercent })
        }

        for (const stat of ['mean', 'min', 'max']) {
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

const docs = await sql`
    SELECT id, parent_id, metadata, created_at
    FROM documents
    WHERE parent_id IS NOT NULL OR id IN (SELECT DISTINCT parent_id FROM documents WHERE parent_id IS NOT NULL)
    ORDER BY created_at ASC
`

const byParent = new Map()
const roots = new Map()
for (const doc of docs) {
    if (doc.parent_id === null) {
        roots.set(doc.id, doc)
    } else {
        if (!byParent.has(doc.parent_id)) byParent.set(doc.parent_id, [])
        byParent.get(doc.parent_id).push(doc)
    }
}

let updated = 0
let skipped = 0

for (const [parentId, revisions] of byParent) {
    const root = roots.get(parentId)
    let baseline = root

    for (const rev of revisions) {
        if (baseline?.metadata && rev.metadata) {
            const diff = computeMetadataDiff(baseline.metadata, rev.metadata)
            await sql`UPDATE documents SET metadata_diff = ${JSON.stringify(diff)} WHERE id = ${rev.id}`
            updated++
        } else {
            skipped++
        }
        baseline = rev
    }
}

console.log(`✓ recomputed metadata_diff for ${updated} revision(s), skipped ${skipped} (missing metadata)`)
