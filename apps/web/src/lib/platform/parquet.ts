import * as XLSX from 'xlsx'
import { ParquetSchema, ParquetWriter } from '@dsnp/parquetjs'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import type { ColumnStats } from '@repo/db/schema'

// Converts an uploaded CSV/XLSX into a columnar Parquet buffer. Columns are
// mapped positionally to the metadata `columns` so Parquet field names match
// exactly what the AI (and later DuckDB) sees. Numeric/boolean columns get
// native Parquet types; everything else is stored as UTF8 (dates as ISO strings)
// — DuckDB can cast on read.

type FieldType = 'DOUBLE' | 'BOOLEAN' | 'UTF8'

function fieldTypeFor(dtype: string): FieldType {
    if (dtype === 'number') return 'DOUBLE'
    if (dtype === 'boolean') return 'BOOLEAN'
    return 'UTF8'
}

function coerce(value: unknown, type: FieldType): number | boolean | string | null {
    if (value === null || value === undefined || value === '') return null
    if (type === 'DOUBLE') {
        const n = typeof value === 'number' ? value : Number(value)
        return Number.isFinite(n) ? n : null
    }
    if (type === 'BOOLEAN') {
        if (typeof value === 'boolean') return value
        const s = String(value).trim().toLowerCase()
        if (s === 'true') return true
        if (s === 'false') return false
        return null
    }
    if (value instanceof Date) return value.toISOString()
    return String(value)
}

export async function fileToParquet(
    buffer: ArrayBuffer,
    columns: ColumnStats[],
): Promise<Buffer> {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
    const sheetName = workbook.SheetNames[0]!
    const sheet = workbook.Sheets[sheetName]!
    const [, ...rawRows] = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: null,
    })
    const dataRows = rawRows.filter((row) => row.some((c) => c !== null && c !== ''))

    const fields = columns.map((col) => ({ name: col.name, type: fieldTypeFor(col.dtype) }))
    const schema = new ParquetSchema(
        Object.fromEntries(
            fields.map((f) => [
                f.name,
                { type: f.type, optional: true, compression: 'GZIP' },
            ]),
        ),
    )

    const path = join(tmpdir(), `ds-${crypto.randomUUID()}.parquet`)
    const writer = await ParquetWriter.openFile(schema, path)
    try {
        for (const row of dataRows) {
            const record: Record<string, number | boolean | string | null> = {}
            fields.forEach((f, i) => {
                record[f.name] = coerce(row[i], f.type)
            })
            await writer.appendRow(record)
        }
    } finally {
        await writer.close()
    }

    const out = await fs.readFile(path)
    await fs.unlink(path).catch(() => {})
    return out
}
