import 'server-only'
import { openDataset, type OpenableDoc } from './dataset-source'
import type { Row } from './dataset-query'

export type RowDiff = {
    commonColumns: string[]
    addedCount: number
    removedCount: number
    addedRows: Row[]
    removedRows: Row[]
    // The two versions have different column sets — the diff runs over the
    // intersection only, so column-level changes are not reflected in the rows.
    schemaChanged: boolean
}

const SAMPLE_LIMIT = 50

function quoteIdent(name: string): string {
    return `"${name.replace(/"/g, '""')}"`
}

// Row-level diff between two versions of the same dataset, computed lazily via
// DuckDB set operations over the columns common to both versions. Set-based, so
// a modified row surfaces as one removed + one added (key-column classification
// is a later enhancement). Added = rows in the newer version absent from the
// older; removed = the reverse. `EXCEPT ALL` preserves row multiplicity.
export async function diffVersions(
    fromDoc: OpenableDoc,
    toDoc: OpenableDoc,
): Promise<RowDiff | null> {
    const from = await openDataset(fromDoc)
    if (!from) return null
    const to = await openDataset(toDoc)
    if (!to) {
        from.release()
        return null
    }

    try {
        const fromNames = new Set(from.dq.columns.map((c) => c.name))
        const toNames = to.dq.columns.map((c) => c.name)
        const common = toNames.filter((n) => fromNames.has(n))
        const schemaChanged =
            common.length !== fromNames.size || common.length !== toNames.length

        if (common.length === 0) {
            return {
                commonColumns: [],
                addedCount: 0,
                removedCount: 0,
                addedRows: [],
                removedRows: [],
                schemaChanged: true,
            }
        }

        // Both Parquet files are registered in the same DuckDB instance (shared
        // connection), so one query can reference both refs. EXCEPT matches by
        // position, so both SELECTs list the common columns explicitly.
        const run = from.dq.run
        const cols = common.map(quoteIdent).join(', ')
        const addedSet = `SELECT ${cols} FROM ${to.dq.ref} EXCEPT ALL SELECT ${cols} FROM ${from.dq.ref}`
        const removedSet = `SELECT ${cols} FROM ${from.dq.ref} EXCEPT ALL SELECT ${cols} FROM ${to.dq.ref}`

        const addedCount = Number(
            run(`SELECT count(*)::INT AS n FROM (${addedSet})`)[0]?.n ?? 0,
        )
        const removedCount = Number(
            run(`SELECT count(*)::INT AS n FROM (${removedSet})`)[0]?.n ?? 0,
        )
        const addedRows = run(`SELECT * FROM (${addedSet}) LIMIT ${SAMPLE_LIMIT}`)
        const removedRows = run(`SELECT * FROM (${removedSet}) LIMIT ${SAMPLE_LIMIT}`)

        return {
            commonColumns: common,
            addedCount,
            removedCount,
            addedRows,
            removedRows,
            schemaChanged,
        }
    } finally {
        from.release()
        to.release()
    }
}
