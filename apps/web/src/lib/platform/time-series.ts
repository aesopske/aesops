import type { DocumentMetadata } from '@repo/db/schema'

const MIN_TIME_SERIES_ROWS = 3
// Small multiples read fine up to about 4 series (e.g. EPRA's 3 fuel types) —
// past that we fall back to a single column rather than an unreadable tangle.
const MAX_VALUE_COLUMNS = 4

export type TimeSeriesClassification =
    | { isTimeSeries: true; timeColumn: string; valueColumns: string[] }
    | { isTimeSeries: false }

// Heuristic only — a datetime column paired with numeric columns is a strong
// enough signal for a trend chart without needing an LLM call per dataset.
export function classifyTimeSeries(
    meta: DocumentMetadata | null,
): TimeSeriesClassification {
    if (!meta || meta.rowCount < MIN_TIME_SERIES_ROWS) return { isTimeSeries: false }

    const timeColumn = meta.columns.find((c) => c.dtype === 'datetime')?.name
    if (!timeColumn) return { isTimeSeries: false }

    const numericCandidates = meta.columns.filter(
        (c) =>
            c.name !== timeColumn &&
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

    return { isTimeSeries: true, timeColumn, valueColumns }
}
