import { resolveQueryDoc, openDataset, type OpenableDoc } from '@/lib/platform/dataset-source'
import { aggregate, aggregateByYearMonth } from '@/lib/platform/dataset-query'
import { C } from '@/lib/platform/chart-theme'
import type { TimeAxis } from '@/lib/platform/time-series'

const MAX_POINTS = 48
const SERIES_COLORS = [C.c1, C.c2, C.c3, C.c4, C.c5]

type SeriesPoint = { key: string; value: number }
type Series = { column: string; points: SeriesPoint[] }
type Pt = { x: number; y: number }

function smoothPath(pts: Pt[]): string {
    if (pts.length < 2) return ''
    let d = `M ${pts[0]!.x.toFixed(1)} ${pts[0]!.y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i]!
        const p2 = pts[i + 1]!
        const p0 = pts[i - 1] ?? p1
        const p3 = pts[i + 2] ?? p2
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
}

// Downsamples an already-chronological series into at most `maxPoints` buckets
// by averaging consecutive runs, so the static SVG stays legible no matter how
// many time buckets the underlying dataset spans.
function downsample(points: SeriesPoint[], maxPoints: number): SeriesPoint[] {
    if (points.length <= maxPoints) return points
    const bucketSize = Math.ceil(points.length / maxPoints)
    const result: SeriesPoint[] = []
    for (let i = 0; i < points.length; i += bucketSize) {
        const slice = points.slice(i, i + bucketSize)
        const avg = slice.reduce((sum, p) => sum + p.value, 0) / slice.length
        result.push({ key: slice[0]!.key, value: avg })
    }
    return result
}

type QueryableDoc = OpenableDoc & { id: string; parentId: string | null }

async function loadSeries(
    doc: QueryableDoc,
    time: TimeAxis,
    valueColumns: string[],
): Promise<Series[] | null> {
    try {
        const queryDoc = await resolveQueryDoc(doc)
        const opened = await openDataset(queryDoc)
        if (!opened) return null
        try {
            const results = await Promise.all(
                valueColumns.map((column) =>
                    time.kind === 'datetime'
                        ? aggregate(opened.dq, {
                              groupBy: time.column,
                              datePart: 'month_year',
                              metric: { column, fn: 'avg' },
                              limit: 5000,
                          })
                        : aggregateByYearMonth(opened.dq, {
                              yearColumn: time.yearColumn,
                              monthColumn: time.monthColumn,
                              metric: { column, fn: 'avg' },
                              limit: 5000,
                          }),
                ),
            )
            // All series share the same GROUP BY, so they should already align —
            // trim to the shortest in case a query returned a different count.
            const minLength = Math.min(...results.map((r) => r.length))
            return valueColumns.map((column, i) => ({
                column,
                points: downsample(results[i]!.slice(0, minLength), MAX_POINTS),
            }))
        } finally {
            opened.release()
        }
    } catch {
        return null
    }
}

type Props = {
    doc: QueryableDoc
    time: TimeAxis
    valueColumns: string[]
}

// Server-rendered only — the aggregated series are turned into static SVG
// markup here, so raw row values never cross to the client.
export async function TimeSeriesChart({ doc, time, valueColumns }: Props) {
    const series = await loadSeries(doc, time, valueColumns)
    if (!series?.length || series.some((s) => s.points.length < 2)) return null

    const plot = { l: 4, r: 396, t: 10, b: 104 }
    const pointCount = series[0]!.points.length
    const allValues = series.flatMap((s) => s.points.map((p) => p.value))
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const range = max - min || 1

    const seriesCoords = series.map((s) => ({
        column: s.column,
        coords: s.points.map((p, i) => ({
            x: plot.l + (i / (pointCount - 1)) * (plot.r - plot.l),
            y: plot.b - ((p.value - min) / range) * (plot.b - plot.t),
        })),
    }))

    const firstLabel = series[0]!.points[0]!.key
    const lastLabel = series[0]!.points[pointCount - 1]!.key
    const isSingleSeries = series.length === 1

    return (
        <div className='rounded-xl border border-border bg-card p-4 shadow-sm'>
            <p className='mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                {series.map((s) => s.column).join(', ')} over time
            </p>
            <svg viewBox='0 0 400 114' className='w-full'>
                <title>{`${series.map((s) => s.column).join(', ')} trend from ${firstLabel} to ${lastLabel}`}</title>
                {isSingleSeries && (
                    <defs>
                        <linearGradient id='tsAreaFill' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0%' stopColor={C.c1} stopOpacity='0.25' />
                            <stop offset='100%' stopColor={C.c1} stopOpacity='0' />
                        </linearGradient>
                    </defs>
                )}
                {seriesCoords.map(({ column, coords }, i) => {
                    const line = smoothPath(coords)
                    const color = SERIES_COLORS[i % SERIES_COLORS.length]!
                    return (
                        <g key={column}>
                            {isSingleSeries && (
                                <path
                                    d={`${line} L ${coords[coords.length - 1]!.x.toFixed(1)} ${plot.b} L ${coords[0]!.x.toFixed(1)} ${plot.b} Z`}
                                    fill='url(#tsAreaFill)'
                                />
                            )}
                            <path
                                d={line}
                                fill='none'
                                stroke={color}
                                strokeWidth='2'
                                strokeLinecap='round'
                            />
                        </g>
                    )
                })}
            </svg>
            <div className='mt-1 flex justify-between text-[11px] text-muted-foreground'>
                <span>{firstLabel}</span>
                <span>{lastLabel}</span>
            </div>
            {!isSingleSeries && (
                <div className='mt-3 flex flex-wrap gap-x-4 gap-y-1.5'>
                    {series.map((s, i) => (
                        <div
                            key={s.column}
                            className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                            <span
                                className='h-2 w-2 shrink-0 rounded-full'
                                style={{
                                    backgroundColor:
                                        SERIES_COLORS[i % SERIES_COLORS.length],
                                }}
                            />
                            {s.column}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
