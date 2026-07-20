import type { ColumnStats } from '@repo/db/schema'

// Query primitives run as DuckDB SQL over a dataset's Parquet artifact. Only the
// matched/aggregated slice crosses the wire — no whole-file load. Column names
// are validated against the known schema (identifiers can't be parameterized),
// and all values are escaped, so tool input can't inject SQL.

export type Row = Record<string, unknown>

export type FilterOp = 'eq' | 'neq' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'is_null' | 'is_not_null'
export type Filter = { column: string; op: FilterOp; value?: string }
export type AggregateFn = 'count' | 'sum' | 'avg' | 'min' | 'max' | 'median'
export type DatePart = 'year' | 'month' | 'month_year' | 'quarter'

export type DatasetQuery = {
    run: (sql: string) => Promise<Row[]>
    /** FROM-clause reference, e.g. read_parquet('…') */
    ref: string
    columns: ColumnStats[]
}

export class UnknownColumnError extends Error {
    constructor(
        public readonly column: string,
        availableColumns: string[],
    ) {
        super(`Unknown column: "${column}". Available columns: ${availableColumns.map((c) => `"${c}"`).join(', ')}`)
        this.name = 'UnknownColumnError'
    }
}

function clamp(n: number, lo: number, hi: number): number {
    return Math.min(Math.max(n, lo), hi)
}

function ident(col: string, dq: DatasetQuery): string {
    if (!dq.columns.some((c) => c.name === col))
        throw new UnknownColumnError(
            col,
            dq.columns.map((c) => c.name),
        )
    return `"${col.replace(/"/g, '""')}"`
}

function lit(v: string): string {
    return `'${v.replace(/'/g, "''")}'`
}

// Textual, null-safe, trimmed+lowercased form of a column — mirrors the old norm()
function txt(colSql: string): string {
    return `lower(trim(coalesce(CAST(${colSql} AS VARCHAR), '')))`
}

function num(colSql: string): string {
    return `TRY_CAST(${colSql} AS DOUBLE)`
}

function buildFilter(f: Filter, dq: DatasetQuery): string {
    const col = ident(f.column, dq)

    // No value to compare — these test for blank/missing cells, e.g. isolating a
    // county-level summary row (sub_county IS NULL) from its detail rows.
    if (f.op === 'is_null') return `(${col} IS NULL OR CAST(${col} AS VARCHAR) = '')`
    if (f.op === 'is_not_null') return `(${col} IS NOT NULL AND CAST(${col} AS VARCHAR) <> '')`

    const value = f.value!
    const v = value.trim().toLowerCase()
    switch (f.op) {
        case 'eq':
            return `(${txt(col)} = ${lit(v)} OR ${num(col)} = TRY_CAST(${lit(value)} AS DOUBLE))`
        case 'neq':
            return `${txt(col)} <> ${lit(v)}`
        case 'contains': {
            const esc = v.replace(/[\\%_]/g, (m) => `\\${m}`)
            return `${txt(col)} LIKE ${lit(`%${esc}%`)} ESCAPE '\\'`
        }
        case 'gt':
            return `${num(col)} > TRY_CAST(${lit(value)} AS DOUBLE)`
        case 'gte':
            return `${num(col)} >= TRY_CAST(${lit(value)} AS DOUBLE)`
        case 'lt':
            return `${num(col)} < TRY_CAST(${lit(value)} AS DOUBLE)`
        case 'lte':
            return `${num(col)} <= TRY_CAST(${lit(value)} AS DOUBLE)`
        case 'in': {
            const items = value.split(',').map((s) => lit(s.trim().toLowerCase()))
            return `${txt(col)} IN (${items.join(', ')})`
        }
    }
}

function whereClause(filters: Filter[] | undefined, dq: DatasetQuery): string {
    if (!filters?.length) return ''
    return `WHERE ${filters.map((f) => buildFilter(f, dq)).join(' AND ')}`
}

export async function queryRows(
    dq: DatasetQuery,
    opts: {
        filters?: Filter[]
        columns?: string[]
        limit?: number
        orderBy?: { column: string; direction?: 'asc' | 'desc' }
    } = {},
): Promise<{ rows: Row[]; matched: number }> {
    const limit = opts.limit === 0 ? 0 : clamp(opts.limit ?? 20, 1, 100)
    const where = whereClause(opts.filters, dq)

    const sel = opts.columns?.length
        ? opts.columns.map((c) => ident(c, dq)).join(', ')
        : '*'
    const order = opts.orderBy
        ? `ORDER BY ${sortExpr(ident(opts.orderBy.column, dq))} ${opts.orderBy.direction === 'desc' ? 'DESC' : 'ASC'} NULLS LAST`
        : ''

    const [countResult, rows] = await Promise.all([
        dq.run(`SELECT count(*)::INT AS n FROM ${dq.ref} ${where}`),
        limit > 0
            ? dq.run(`SELECT ${sel} FROM ${dq.ref} ${where} ${order} LIMIT ${limit}`)
            : Promise.resolve([]),
    ])
    const matched = Number(countResult[0]?.n ?? 0)
    return { rows, matched }
}

// Parses a column into a TIMESTAMP, tolerating ISO plus common textual/numeric
// date formats — mirrors the leniency of the old JS `new Date(...)` path.
function tsExpr(colSql: string): string {
    return `coalesce(TRY_CAST(${colSql} AS TIMESTAMP), TRY_STRPTIME(CAST(${colSql} AS VARCHAR), ['%b %Y', '%B %Y', '%b %d, %Y', '%B %d, %Y', '%d-%m-%Y', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%d']))`
}

// Orders rows chronologically when the column parses as a date, numerically
// otherwise — lets callers sort by date or by magnitude without knowing the
// column's underlying type upfront. Both branches resolve to DOUBLE (epoch
// seconds for dates) so they coalesce without a type mismatch.
function sortExpr(colSql: string): string {
    return `coalesce(epoch(${tsExpr(colSql)}), TRY_CAST(${colSql} AS DOUBLE))`
}

function keyExpr(colSql: string, datePart?: DatePart): string {
    if (!datePart) return `coalesce(CAST(${colSql} AS VARCHAR), '∅')`
    const ts = tsExpr(colSql)
    let expr: string
    switch (datePart) {
        case 'year':
            expr = `CAST(year(${ts}) AS VARCHAR)`
            break
        case 'month':
            expr = `strftime(${ts}, '%b')`
            break
        case 'month_year':
            expr = `strftime(${ts}, '%b %Y')`
            break
        case 'quarter':
            expr = `('Q' || CAST(quarter(${ts}) AS VARCHAR) || ' ' || CAST(year(${ts}) AS VARCHAR))`
            break
    }
    // Unparseable → fall back to the raw value, then ∅ for null
    return `coalesce(${expr}, CAST(${colSql} AS VARCHAR), '∅')`
}

function metricExpr(dq: DatasetQuery, metric?: { column: string; fn: AggregateFn }): string {
    if (!metric) return 'count(*)::INT'
    const c = num(ident(metric.column, dq))
    const agg =
        metric.fn === 'sum' ? `sum(${c})`
        : metric.fn === 'avg' ? `avg(${c})`
        : metric.fn === 'min' ? `min(${c})`
        : metric.fn === 'max' ? `max(${c})`
        : `median(${c})`
    return `round(coalesce(${agg}, 0), 4)::DOUBLE`
}

export async function aggregate(
    dq: DatasetQuery,
    opts: {
        groupBy?: string | string[]
        datePart?: DatePart
        metric?: { column: string; fn: Exclude<AggregateFn, 'count'> }
        limit?: number
        rowFilters?: Filter[]
    },
): Promise<{ key: string; value: number }[]> {
    const limit = opts.limit === 0 ? 0 : clamp(opts.limit ?? 20, 1, 5000)
    if (limit === 0) return []

    const groupCols = opts.groupBy === undefined
        ? []
        : Array.isArray(opts.groupBy) ? opts.groupBy : [opts.groupBy]

    const where = whereClause(opts.rowFilters, dq)
    const valSql = metricExpr(dq, opts.metric)

    if (groupCols.length === 0) {
        const sql = `SELECT ${valSql} AS v FROM ${dq.ref} ${where}`
        const rows = await dq.run(sql)
        return [{ key: 'Total', value: Number(rows[0]?.v ?? 0) }]
    }

    const keyExprs = groupCols.map((c) => keyExpr(ident(c, dq), opts.datePart))
    const keySql =
        keyExprs.length === 1 ? keyExprs[0]! : `concat_ws(' | ', ${keyExprs.join(', ')})`

    // Date groupings sort chronologically so time axes read left-to-right; every
    // other grouping sorts by value descending. For multi-column date groupings
    // (e.g. ["Town", <date>]) only the date column parses, so coalescing the
    // per-column timestamps yields that group's date. `month` is the sole
    // exception: it buckets by month-of-year across years, so it orders Jan…Dec.
    const groupTs = `coalesce(${groupCols.map((c) => tsExpr(ident(c, dq))).join(', ')})`
    const order =
        opts.datePart === 'month'
            ? `ORDER BY min(month(${groupTs})) NULLS LAST`
            : opts.datePart
              ? `ORDER BY min(${groupTs}) NULLS LAST`
              : `ORDER BY v DESC`

    const sql = `SELECT ${keySql} AS k, ${valSql} AS v FROM ${dq.ref} ${where} GROUP BY ${keySql} ${order} LIMIT ${limit}`
    const rows = await dq.run(sql)
    return rows.map((r) => ({ key: String(r.k ?? '∅'), value: Number(r.v ?? 0) }))
}

// Aggregates by a separate year column (plus an optional month column), for
// datasets that split time into two columns instead of one parseable date —
// a common shape in this platform's scraped datasets. Handles both a numeric
// month (1-12) and a month-name string via `coalesce`, so callers don't need
// to know which form the source data uses.
export async function aggregateByYearMonth(
    dq: DatasetQuery,
    opts: {
        yearColumn: string
        monthColumn?: string
        metric: { column: string; fn: Exclude<AggregateFn, 'count'> }
        limit?: number
    },
): Promise<{ key: string; value: number }[]> {
    const limit = opts.limit === 0 ? 0 : clamp(opts.limit ?? 20, 1, 5000)
    if (limit === 0) return []

    const yearCol = ident(opts.yearColumn, dq)
    const valSql = metricExpr(dq, opts.metric)

    if (!opts.monthColumn) {
        const yearInt = `TRY_CAST(${yearCol} AS INTEGER)`
        const sql = `SELECT CAST(${yearInt} AS VARCHAR) AS k, ${valSql} AS v FROM ${dq.ref} WHERE ${yearCol} IS NOT NULL GROUP BY ${yearInt} ORDER BY ${yearInt} LIMIT ${limit}`
        const rows = await dq.run(sql)
        return rows.map((r) => ({ key: String(r.k ?? '∅'), value: Number(r.v ?? 0) }))
    }

    const monthCol = ident(opts.monthColumn, dq)
    const yearInt = `TRY_CAST(${yearCol} AS INTEGER)`
    const dateExpr = `coalesce(make_date(${yearInt}, TRY_CAST(${monthCol} AS INTEGER), 1), TRY_STRPTIME(CAST(${monthCol} AS VARCHAR) || ' ' || CAST(${yearInt} AS VARCHAR), ['%B %Y', '%b %Y']))`
    const sql = `SELECT strftime(${dateExpr}, '%b %Y') AS k, ${valSql} AS v FROM ${dq.ref} WHERE ${dateExpr} IS NOT NULL GROUP BY ${dateExpr} ORDER BY ${dateExpr} LIMIT ${limit}`
    const rows = await dq.run(sql)
    return rows.map((r) => ({ key: String(r.k ?? '∅'), value: Number(r.v ?? 0) }))
}

export async function distinctValues(
    dq: DatasetQuery,
    opts: { column: string; limit?: number },
): Promise<{ total: number; values: { value: string; count: number }[] }> {
    const limit = opts.limit === 0 ? 0 : clamp(opts.limit ?? 50, 1, 200)
    const col = ident(opts.column, dq)
    const notEmpty = `${col} IS NOT NULL AND CAST(${col} AS VARCHAR) <> ''`

    const [countResult, valueRows] = await Promise.all([
        dq.run(`SELECT count(DISTINCT CAST(${col} AS VARCHAR))::INT AS n FROM ${dq.ref} WHERE ${notEmpty}`),
        limit > 0
            ? dq.run(
                  `SELECT CAST(${col} AS VARCHAR) AS value, count(*)::INT AS count FROM ${dq.ref} WHERE ${notEmpty} GROUP BY 1 ORDER BY count DESC LIMIT ${limit}`,
              )
            : Promise.resolve([]),
    ])
    const total = Number(countResult[0]?.n ?? 0)
    const values = valueRows.map((r) => ({ value: String(r.value), count: Number(r.count) }))
    return { total, values }
}
