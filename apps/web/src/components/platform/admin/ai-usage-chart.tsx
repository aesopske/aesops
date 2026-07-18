'use client'

import {
    ComposedChart,
    Bar,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { TOOLTIP_STYLE, TICK_STYLE } from '@/lib/platform/chart-theme'
import {
    AI_ROUTE_ORDER,
    aiRouteColor,
    aiRouteLabel,
} from '@/lib/platform/ai-usage-labels'

export type AiUsageDailyRow = {
    bucketStart: Date
    route: string
    requests: number
    errors: number
}

type ChartRow = { date: string; label: string; errors: number } & Record<
    string,
    string | number
>

function pivotDaily(rows: AiUsageDailyRow[]): ChartRow[] {
    const byDate = new Map<string, ChartRow>()
    for (const row of rows) {
        const date = row.bucketStart.toISOString().slice(0, 10)
        const existing = byDate.get(date)
        if (existing) {
            existing[row.route] = row.requests
            existing.errors += row.errors
        } else {
            byDate.set(date, {
                date,
                label: format(row.bucketStart, 'MMM d'),
                errors: row.errors,
                [row.route]: row.requests,
            })
        }
    }
    return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export function AiUsageChart({ data }: { data: AiUsageDailyRow[] }) {
    const total = data.reduce((sum, row) => sum + row.requests, 0)

    if (total === 0) {
        return (
            <p className='py-8 text-center text-sm text-muted-foreground'>
                No AI usage in this period.
            </p>
        )
    }

    const chartData = pivotDaily(data)
    // Fixed order, filtered to routes with data this period — a route's color
    // stays pinned to its slot in AI_ROUTE_ORDER even as the set present varies.
    const routes = AI_ROUTE_ORDER.filter((route) =>
        data.some((row) => row.route === route),
    )

    return (
        <ResponsiveContainer width='100%' height={320}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
                <CartesianGrid vertical={false} stroke='var(--border)' />
                <XAxis
                    dataKey='label'
                    tick={TICK_STYLE}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    interval='preserveStartEnd'
                />
                <YAxis
                    allowDecimals={false}
                    tick={TICK_STYLE}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    width={40}
                    label={{
                        value: 'Requests',
                        angle: -90,
                        position: 'insideLeft',
                        style: { ...TICK_STYLE, textAnchor: 'middle' },
                    }}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <Legend
                    verticalAlign='bottom'
                    align='center'
                    height={32}
                    wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)', paddingTop: 8 }}
                />
                {routes.map((route, i) => (
                    <Bar
                        key={route}
                        dataKey={route}
                        name={aiRouteLabel(route)}
                        stackId='requests'
                        fill={aiRouteColor(route)}
                        radius={i === routes.length - 1 ? [3, 3, 0, 0] : 0}
                        maxBarSize={28}
                    />
                ))}
                <Line
                    dataKey='errors'
                    name='Errors'
                    stroke='var(--destructive)'
                    strokeWidth={2}
                    dot={{
                        r: 4,
                        fill: 'var(--destructive)',
                        stroke: 'var(--card)',
                        strokeWidth: 2,
                    }}
                    activeDot={{ r: 4 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    )
}
