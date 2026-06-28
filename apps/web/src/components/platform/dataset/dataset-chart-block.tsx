'use client'

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { Alert, AlertDescription } from '@repo/ui/components/alert'
import { AlertCircle } from 'lucide-react'
import { C, TOOLTIP_STYLE, TICK_STYLE } from '@/lib/platform/chart-theme'

const PALETTE = [C.c1, C.c2, C.c3, C.c4, C.c5]

type InlineChartConfig = {
    chartType: 'bar' | 'line' | 'area'
    title?: string
    xKey: string
    series: { key: string; label?: string }[]
    data: Record<string, unknown>[]
}

type Props = { code: string; isIncomplete: boolean }

function Shell({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div className='not-prose my-4 rounded-xl border border-border bg-card p-4 shadow-sm'>
            {title && <h4 className='mb-3 text-sm font-medium text-foreground'>{title}</h4>}
            {children}
        </div>
    )
}

function isValidConfig(c: unknown): c is InlineChartConfig {
    if (!c || typeof c !== 'object') return false
    const cfg = c as Partial<InlineChartConfig>
    return (
        (cfg.chartType === 'bar' || cfg.chartType === 'line' || cfg.chartType === 'area') &&
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

    const sharedAxes = (
        <>
            <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tick={TICK_STYLE}
                interval='preserveStartEnd'
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tick={TICK_STYLE}
                width={36}
                domain={['auto', 'auto']}
            />
        </>
    )

    return (
        <Shell title={title}>
            {/* Explicit pixel height so ResponsiveContainer always measures > 0 */}
            <div style={{ width: '100%', height: 256 }}>
                <ResponsiveContainer
                    width='100%'
                    height='100%'
                    initialDimension={{ width: 320, height: 256 }}
                >
                    {chartType === 'bar' ? (
                        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' vertical={false} />
                            {sharedAxes}
                            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
                            {series.map((s, i) => (
                                <Bar key={s.key} dataKey={s.key} name={s.label ?? s.key} fill={PALETTE[i % PALETTE.length]} radius={[3, 3, 0, 0]} />
                            ))}
                        </BarChart>
                    ) : chartType === 'line' ? (
                        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
                            {sharedAxes}
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
                            {series.map((s, i) => (
                                <Line key={s.key} type='monotone' dataKey={s.key} name={s.label ?? s.key} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} />
                            ))}
                        </LineChart>
                    ) : (
                        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
                            {sharedAxes}
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            {showLegend && <Legend wrapperStyle={{ fontSize: 11 }} />}
                            {series.map((s, i) => (
                                <Area key={s.key} type='monotone' dataKey={s.key} name={s.label ?? s.key} stroke={PALETTE[i % PALETTE.length]} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.15} strokeWidth={2} />
                            ))}
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </Shell>
    )
}
