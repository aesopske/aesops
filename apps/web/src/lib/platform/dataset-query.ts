import * as XLSX from 'xlsx'

// On-demand row access for AI tools. Fetches the public file URL, parses with
// the same xlsx path as extractMetadata, and runs in-memory queries. No
// persisted artifact — works retroactively on every existing dataset.

export type QueryableDoc = {
    url: string
    storageKey: string
    size: number
}

type Row = Record<string, unknown>

const MAX_BYTES = 10 * 1024 * 1024 // 10MB — guard against serverless timeouts
const CACHE_TTL_MS = 5 * 60 * 1000
const CACHE_MAX = 20

const cache = new Map<string, { rows: Row[]; at: number }>()

export class DatasetTooLargeError extends Error {
    constructor(public readonly size: number) {
        super(`Dataset is too large to query inline (${size} bytes)`)
        this.name = 'DatasetTooLargeError'
    }
}

export async function loadRows(doc: QueryableDoc): Promise<Row[]> {
    if (doc.size > MAX_BYTES) throw new DatasetTooLargeError(doc.size)

    const cached = cache.get(doc.storageKey)
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.rows

    const res = await fetch(doc.url)
    if (!res.ok) throw new Error(`Failed to fetch dataset file (${res.status})`)
    const buffer = await res.arrayBuffer()

    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
    const sheetName = workbook.SheetNames[0]!
    const sheet = workbook.Sheets[sheetName]!
    const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: null })

    if (cache.size >= CACHE_MAX) {
        const oldest = [...cache.entries()].sort((a, b) => a[1].at - b[1].at)[0]
        if (oldest) cache.delete(oldest[0])
    }
    cache.set(doc.storageKey, { rows, at: Date.now() })

    return rows
}

// ─── query primitives ─────────────────────────────────────────────────────────

export type FilterOp = 'eq' | 'neq' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in'
export type Filter = { column: string; op: FilterOp; value: string }

function norm(v: unknown): string {
    return String(v ?? '').trim().toLowerCase()
}

function matches(cell: unknown, op: FilterOp, value: string | number): boolean {
    switch (op) {
        case 'eq':
            return norm(cell) === norm(value) || Number(cell) === Number(value)
        case 'neq':
            return norm(cell) !== norm(value)
        case 'contains':
            return norm(cell).includes(norm(value))
        case 'gt':
            return Number(cell) > Number(value)
        case 'gte':
            return Number(cell) >= Number(value)
        case 'lt':
            return Number(cell) < Number(value)
        case 'lte':
            return Number(cell) <= Number(value)
        case 'in': {
            const values = String(value).split(',').map((v) => v.trim().toLowerCase())
            return values.includes(norm(cell))
        }
    }
}

export function queryRows(
    rows: Row[],
    opts: { filters?: Filter[]; columns?: string[]; limit?: number } = {},
): { rows: Row[]; matched: number } {
    const limit = opts.limit === 0 ? 0 : Math.min(Math.max(opts.limit ?? 20, 1), 100)
    const filtered = opts.filters?.length
        ? rows.filter((row) => opts.filters!.every((f) => matches(row[f.column], f.op, f.value)))
        : rows

    const projected = opts.columns?.length
        ? filtered.map((row) => {
              const out: Row = {}
              for (const col of opts.columns!) out[col] = row[col] ?? null
              return out
          })
        : filtered

    return { rows: limit === 0 ? [] : projected.slice(0, limit), matched: filtered.length }
}

export type AggregateFn = 'count' | 'sum' | 'avg' | 'min' | 'max'
export type DatePart = 'year' | 'month' | 'month_year' | 'quarter'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_ORDER: Record<string, number> = Object.fromEntries(MONTH_NAMES.map((m, i) => [m, i]))

function extractDatePart(raw: unknown, part: DatePart): string {
    // Handles JS Date (from xlsx cellDates), ISO strings, and "Jan 2025"-style strings
    let d: Date | null = null
    if (raw instanceof Date && !isNaN(raw.getTime())) {
        d = raw
    } else if (typeof raw === 'string') {
        const parsed = new Date(raw)
        if (!isNaN(parsed.getTime())) d = parsed
    }
    if (!d) return String(raw ?? '∅')
    switch (part) {
        case 'year':       return String(d.getFullYear())
        case 'month':      return MONTH_NAMES[d.getMonth()]!
        case 'month_year': return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
        case 'quarter':    return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`
    }
}

function round(n: number): number {
    return Number.isInteger(n) ? n : +n.toFixed(4)
}

export function aggregate(
    rows: Row[],
    opts: {
        groupBy: string
        datePart?: DatePart
        metric?: { column: string; fn: Exclude<AggregateFn, 'count'> }
        limit?: number
        rowFilters?: Filter[]
    },
): { key: string; value: number }[] {
    const limit = opts.limit === 0 ? 0 : Math.min(Math.max(opts.limit ?? 20, 1), 5000)
    const source = opts.rowFilters?.length
        ? rows.filter((row) => opts.rowFilters!.every((f) => matches(row[f.column], f.op, f.value)))
        : rows
    const groups = new Map<string, number[]>()

    for (const row of source) {
        const key = opts.datePart
            ? extractDatePart(row[opts.groupBy], opts.datePart)
            : String(row[opts.groupBy] ?? '∅')
        const bucket = groups.get(key) ?? []
        if (opts.metric) {
            const n = Number(row[opts.metric.column])
            if (Number.isFinite(n)) bucket.push(n)
        } else {
            bucket.push(1)
        }
        groups.set(key, bucket)
    }

    const result = [...groups.entries()].map(([key, nums]) => {
        let value: number
        if (!opts.metric) {
            value = nums.length
        } else {
            switch (opts.metric.fn) {
                case 'sum':
                    value = nums.reduce((a, b) => a + b, 0)
                    break
                case 'avg':
                    value = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
                    break
                case 'min':
                    value = nums.length ? Math.min(...nums) : 0
                    break
                case 'max':
                    value = nums.length ? Math.max(...nums) : 0
                    break
            }
        }
        return { key, value: round(value) }
    })

    // For month grouping, sort chronologically so charts render in calendar order
    const sorted = opts.datePart === 'month'
        ? result.sort((a, b) => (MONTH_ORDER[a.key] ?? 0) - (MONTH_ORDER[b.key] ?? 0))
        : result.sort((a, b) => b.value - a.value)
    return limit === 0 ? [] : sorted.slice(0, limit)
}

export function distinctValues(
    rows: Row[],
    opts: { column: string; limit?: number },
): { total: number; values: { value: string; count: number }[] } {
    const limit = opts.limit === 0 ? 0 : Math.min(Math.max(opts.limit ?? 50, 1), 200)
    const freq = new Map<string, number>()

    for (const row of rows) {
        const v = row[opts.column]
        if (v === null || v === undefined || v === '') continue
        const key = String(v)
        freq.set(key, (freq.get(key) ?? 0) + 1)
    }

    const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1])
    return {
        total: sorted.length,
        values: limit === 0 ? [] : sorted.slice(0, limit).map(([value, count]) => ({ value, count })),
    }
}
