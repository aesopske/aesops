import type { DocumentMetadata } from '@repo/db/schema'

const MIN_TIME_SERIES_ROWS = 3
// Small multiples read fine up to about 4 series (e.g. EPRA's 3 fuel types) —
// past that we fall back to a single column rather than an unreadable tangle.
const MAX_VALUE_COLUMNS = 4

const YEAR_NAME_RE = /\byear\b/i
const MONTH_NAME_RE = /\bmonth\b/i

export type TimeAxis =
    | { kind: 'datetime'; column: string }
    | { kind: 'year-month'; yearColumn: string; monthColumn?: string }

export type TimeSeriesClassification =
    | { isTimeSeries: true; time: TimeAxis; valueColumns: string[] }
    | { isTimeSeries: false }

// Heuristic only — a recognizable time axis paired with numeric columns is a
// strong enough signal for a trend chart without needing an LLM call per
// dataset. Two shapes are recognized: a single parsed datetime column, or a
// split year (+ optional month) column pair, which is common in this
// platform's scraped government datasets (e.g. CBK's year/month tables).
export function classifyTimeSeries(
    meta: DocumentMetadata | null,
): TimeSeriesClassification {
    if (!meta || meta.rowCount < MIN_TIME_SERIES_ROWS) return { isTimeSeries: false }

    const datetimeColumn = meta.columns.find((c) => c.dtype === 'datetime')?.name
    const yearColumn = meta.columns.find(
        (c) => c.dtype === 'number' && YEAR_NAME_RE.test(c.name),
    )?.name
    const monthColumn = meta.columns.find(
        (c) => (c.dtype === 'number' || c.dtype === 'string') && MONTH_NAME_RE.test(c.name),
    )?.name

    const time: TimeAxis | undefined = datetimeColumn
        ? { kind: 'datetime', column: datetimeColumn }
        : yearColumn
          ? { kind: 'year-month', yearColumn, monthColumn }
          : undefined
    if (!time) return { isTimeSeries: false }

    const excludedColumns = new Set(
        time.kind === 'datetime'
            ? [time.column]
            : [time.yearColumn, time.monthColumn].filter((c): c is string => !!c),
    )
    const numericCandidates = meta.columns.filter(
        (c) =>
            !excludedColumns.has(c.name) &&
            c.dtype === 'number' &&
            c.mean !== undefined &&
            c.uniqueCount > 1,
    )
    if (!numericCandidates.length) return { isTimeSeries: false }

    // Few enough numeric columns that they're plausibly peer measurements (like
    // three fuel-price columns) — show them all as small multiples. Otherwise
    // there's no heuristic way to tell which numeric columns are related, so
    // just surface the first (by convention, datasets tend to lead with their
    // primary metric).
    const valueColumns =
        numericCandidates.length <= MAX_VALUE_COLUMNS
            ? numericCandidates.map((c) => c.name)
            : [numericCandidates[0]!.name]

    return { isTimeSeries: true, time, valueColumns }
}
