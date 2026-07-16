'use client'

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    ResponsiveContainer,
} from 'recharts'
import { Alert, AlertDescription } from '@repo/ui/components/alert'
import { AlertCircle } from 'lucide-react'
import {
    C,
    TOOLTIP_STYLE,
    TICK_STYLE,
    formatCompactNumber,
    labelFractionDigits,
    shouldShowValueLabels,
} from '@/lib/platform/chart-theme'
import { ChartDataView } from '@/components/platform/dataset/chart-data-view'
import { ChartXAxisTick } from '@/components/platform/dataset/chart-x-axis-tick'

const PALETTE = [C.c1, C.c2, C.c3, C.c4, C.c5]

type InlineChartConfig = {
    chartType: 'bar' | 'line' | 'area' | 'pie' | 'donut'
    title?: string
    xKey: string
    series: { key: string; label?: string }[]
    data: Record<string, unknown>[]
}

type Props = { code: string; isIncomplete: boolean }

type ChartChildren = React.ReactNode | ((height: number | string) => React.ReactNode)

function Shell({ title, json, children }: { title?: string; json?: string; children: ChartChildren }) {
    return (
        <div className='not-prose relative my-4 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm'>
            <img
                src='/logo-mark.svg'
                alt=''
                aria-hidden='true'
                className='pointer-events-none absolute bottom-3 left-4 h-6 w-6 select-none'
            />
            {json ? (
                <ChartDataView json={json} title={title}>
                    {children}
                </ChartDataView>
            ) : (
                <>
                    {title && <h4 className='mb-3 text-sm font-medium text-foreground'>{title}</h4>}
                    {typeof children === 'function' ? children(256) : children}
                </>
            )}
        </div>
    )
}

// Trend lines read better zoomed to their actual range rather than a forced 0 baseline
function getLineYDomain(data: Record<string, unknown>[], series: { key: string }[]): [number, number] | undefined {
    let min = Infinity
    let max = -Infinity
    for (const row of data) {
        for (const s of series) {
            const value = row[s.key]
            if (typeof value === 'number') {
                if (value < min) min = value
                if (value > max) max = value
            }
        }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined
    const padding = (max - min) * 0.1 || Math.abs(max) * 0.05 || 1
    return [Math.floor(min - padding), Math.ceil(max + padding)]
}

function isValidConfig(c: unknown): c is InlineChartConfig {
    if (!c || typeof c !== 'object') return false
    const cfg = c as Partial<InlineChartConfig>
    return (
        (cfg.chartType === 'bar' ||
            cfg.chartType === 'line' ||
            cfg.chartType === 'area' ||
            cfg.chartType === 'pie' ||
            cfg.chartType === 'donut') &&
        typeof cfg.xKey === 'string' &&
        Array.isArray(cfg.series) &&
        cfg.series.length > 0 &&
        Array.isArray(cfg.data)
    )
}

export function DatasetChartBlock({ code, isIncomplete }: Props) {
    if (isIncomplete) {
        return (
            <Shell>
                <div className='h-64 w-full animate-pulse rounded-lg bg-muted/60' />
            </Shell>
        )
    }

    // Stream is done — parse once and show error alert for any failure
    let parsed: unknown
    try {
        parsed = JSON.parse(code.trim())
    } catch {
        return (
            <div className='not-prose my-4'>
                <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                        The chart didn&apos;t load properly. Try asking the same question again.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!isValidConfig(parsed)) {
        return (
            <div className='not-prose my-4'>
                <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                        The chart couldn&apos;t be displayed. Try rephrasing your question or asking for a different chart type.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    const config = parsed

    const { chartType, title, xKey, series, data } = config
    const showLegend = series.length > 1
    // Trim decimals as bars/points pile up (categories × series), and once too
    // crowded, hide the value labels entirely — the tooltip still has the exact
    // value on hover. Both relax when expanded to fullscreen, where there's
    // room to show everything.
    const totalPoints = data.length * series.length
    const prettyJson = JSON.stringify(config, null, 2)

    if (chartType === 'pie' || chartType === 'donut') {
        const valueKey = series[0]!.key
        return (
            <Shell title={title} json={prettyJson}>
                {(height) => (
                    <div style={{ width: '100%', height }}>
                        <ResponsiveContainer
                            width='100%'
                            height='100%'
                            initialDimension={{ width: 320, height: typeof height === 'number' ? height : 480 }}
                        >
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey={valueKey}
                                    nameKey={xKey}
                                    cx='50%'
                                    cy='50%'
                                    outerRadius={90}
                                    innerRadius={chartType === 'donut' ? 55 : 0}
                                    paddingAngle={chartType === 'donut' ? 2 : 0}
                                    stroke='var(--card)'
                                    strokeWidth={2}
                                >
                                    {data.map((_, i) => (
                                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Shell>
        )
    }

    return (
        <Shell title={title} json={prettyJson}>
            {(height) => {
                const isExpanded = height === '100%'
                const showValueLabels = isExpanded || shouldShowValueLabels(totalPoints)
                const valueLabelFormatter = (v: number) =>
                    formatCompactNumber(v, labelFractionDigits(totalPoints))
                // Show every tick for reasonably-sized datasets; only thin them out
                // (evenly, not recharts' uneven 'preserveStartEnd') once there are too
                // many to fit legibly.
                const xAxisInterval = data.length > 20 ? Math.ceil(data.length / 12) - 1 : 0
                const xAxis = (
                    <XAxis
                        dataKey={xKey}
                        tickLine={false}
                        axisLine={false}
                        interval={xAxisInterval}
                        height={36}
                        tick={<ChartXAxisTick totalCount={data.length} />}
                    />
                )

                return (
                <div style={{ width: '100%', height }}>
                    <ResponsiveContainer
                        width='100%'
                        height='100%'
                        initialDimension={{ width: 320, height: typeof height === 'number' ? height : 480 }}
                    >
                        {chartType === 'bar' ? (
                            <BarChart data={data} margin={{ top: 20, right: 16, bottom: 0, left: 16 }}>
                                <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
                                {xAxis}
                                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                                {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
                                {series.map((s, i) => (
                                    <Bar key={s.key} dataKey={s.key} name={s.label ?? s.key} fill={PALETTE[i % PALETTE.length]} radius={[3, 3, 0, 0]}>
                                        {showValueLabels && (
                                            <LabelList
                                                position='top'
                                                offset={12}
                                                className='fill-foreground'
                                                fontSize={12}
                                                formatter={valueLabelFormatter}
                                            />
                                        )}
                                    </Bar>
                                ))}
                            </BarChart>
                        ) : chartType === 'line' ? (
                            <LineChart data={data} margin={{ top: 20, right: 16, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
                                <XAxis dataKey={xKey} hide height={0} />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={TICK_STYLE}
                                    width={40}
                                    domain={getLineYDomain(data, series) ?? ['auto', 'auto']}
                                    tickFormatter={formatCompactNumber}
                                />
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                {showLegend && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 0 }} />}
                                {series.map((s, i) => (
                                    <Line key={s.key} type='monotone' dataKey={s.key} name={s.label ?? s.key} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false}>
                                        {showValueLabels && (
                                            <LabelList
                                                position='top'
                                                offset={12}
                                                className='fill-foreground'
                                                fontSize={12}
                                                formatter={valueLabelFormatter}
                                            />
                                        )}
                                    </Line>
                                ))}
                            </LineChart>
                        ) : (
                            <AreaChart data={data} margin={{ top: 20, right: 16, bottom: 0, left: 16 }}>
                                <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
                                {xAxis}
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
                                <defs>
                                    {series.map((s, i) => (
                                        <linearGradient key={s.key} id={`fill-${s.key}`} x1='0' y1='0' x2='0' y2='1'>
                                            <stop offset='5%' stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.8} />
                                            <stop offset='95%' stopColor={PALETTE[i % PALETTE.length]} stopOpacity={0.1} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                {series.map((s, i) => (
                                    <Area
                                        key={s.key}
                                        type='monotone'
                                        dataKey={s.key}
                                        name={s.label ?? s.key}
                                        stackId='a'
                                        stroke={PALETTE[i % PALETTE.length]}
                                        fill={`url(#fill-${s.key})`}
                                        fillOpacity={0.4}
                                        strokeWidth={2}
                                    >
                                        {showValueLabels && (
                                            <LabelList
                                                position='top'
                                                offset={12}
                                                className='fill-foreground'
                                                fontSize={12}
                                                formatter={valueLabelFormatter}
                                            />
                                        )}
                                    </Area>
                                ))}
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>
                )
            }}
        </Shell>
    )
}
