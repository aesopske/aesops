import * as XLSX from 'xlsx'
import type { ColumnStats, DocumentMetadata } from '@repo/db/schema'

// ─── stats helpers ────────────────────────────────────────────────────────────

function inferDtype(values: unknown[]): string {
    const nonNull = values.filter((v) => v !== null && v !== undefined && v !== '')
    if (!nonNull.length) return 'empty'
    const types = new Set(nonNull.map((v) => {
        if (v instanceof Date) return 'datetime'
        if (typeof v === 'boolean') return 'boolean'
        if (typeof v === 'number') return 'number'
        return 'string'
    }))
    if (types.size === 1) return [...types][0]!
    if (types.size === 2 && types.has('datetime') && types.has('number')) return 'datetime'
    return 'mixed'
}

function numericStats(values: number[]) {
    if (!values.length) return {}
    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    const mean = sum / values.length
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 !== 0
        ? sorted[mid]!
        : (sorted[mid - 1]! + sorted[mid]!) / 2
    return {
        mean: +mean.toFixed(4),
        std: +Math.sqrt(variance).toFixed(4),
        min: sorted[0]!,
        max: sorted[sorted.length - 1]!,
        median: +median.toFixed(4),
    }
}

function isYearLike(name: string, values: number[]): boolean {
    if (!/\byear\b/i.test(name)) return false
    return values.every((v) => Number.isInteger(v) && v >= 1000 && v <= 3000)
}

function topValues(values: unknown[], limit = 5): { value: string; count: number }[] {
    const freq = new Map<string, number>()
    for (const v of values) {
        if (v === null || v === undefined || v === '') continue
        const key = String(v)
        freq.set(key, (freq.get(key) ?? 0) + 1)
    }
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([value, count]) => ({ value, count }))
}

// ─── main extractor ───────────────────────────────────────────────────────────
// Accepts an ArrayBuffer so it runs identically in the browser and on the server.

export function extractMetadata(buffer: ArrayBuffer): DocumentMetadata {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
    const sheetName = workbook.SheetNames[0]!
    const sheet = workbook.Sheets[sheetName]!

    const [headerRow = [], ...rawRows] = XLSX.utils.sheet_to_json<unknown[]>(
        sheet,
        { header: 1, defval: null },
    )

    const dataRows = rawRows.filter((row) => row.some((c) => c !== null && c !== ''))
    const rowCount = dataRows.length
    const columnCount = headerRow.length

    const columns: ColumnStats[] = headerRow.map((header, i) => {
        const values = dataRows.map((row) => row[i] ?? null)
        const nullCount = values.filter((v) => v === null || v === undefined || v === '').length
        const nullPercent = rowCount > 0 ? Math.round((nullCount / rowCount) * 100) : 0
        const uniqueCount = new Set(values.map(String)).size
        const dtype = inferDtype(values)

        const col: ColumnStats = {
            name: header !== null && header !== '' ? String(header) : `Column ${i + 1}`,
            dtype,
            nullCount,
            nullPercent,
            uniqueCount,
        }

        if (dtype === 'number') {
            const nums = values.filter((v): v is number => typeof v === 'number')
            if (isYearLike(col.name, nums)) {
                const sorted = [...nums].sort((a, b) => a - b)
                col.min = sorted[0]
                col.max = sorted[sorted.length - 1]
            } else {
                Object.assign(col, numericStats(nums))
            }
        } else {
            col.topValues = topValues(values)
        }

        col.sampleValues = values
            .filter((v) => v !== null && v !== undefined && v !== '')
            .slice(0, 3)
            .map((v) => (typeof v === 'number' ? v : String(v)))

        return col
    })

    const sampleRows = dataRows.slice(0, 5).map((row) => {
        const obj: Record<string, unknown> = {}
        headerRow.forEach((h, i) => { obj[String(h ?? i)] = row[i] ?? null })
        return obj
    })

    return {
        rowCount,
        columnCount,
        columns,
        sampleRows,
        sheetNames: workbook.SheetNames.length > 1 ? workbook.SheetNames : undefined,
        analyzedSheet: sheetName,
    }
}
