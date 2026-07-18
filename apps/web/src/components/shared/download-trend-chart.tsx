'use client'

import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { C, TOOLTIP_STYLE, TICK_STYLE } from '@/lib/platform/chart-theme'

export type DownloadPeriod = 'day' | 'week' | 'month' | 'year'
export type DownloadBucket = { bucketStart: string | Date; count: number }

const BUCKET_LABEL_FORMAT: Record<DownloadPeriod, string> = {
    day: 'MMM d',
    week: 'MMM d',
    month: 'MMM yyy',
    year: 'yyyy',
}

type Props = { data: DownloadBucket[]; period: DownloadPeriod }

export function DownloadTrendChart({ data, period }: Props) {
    const total = data.reduce((sum, row) => sum + row.count, 0)

    if (total === 0) {
        return (
            <p className='py-8 text-center text-sm text-muted-foreground'>
                No downloads in this period.
            </p>
        )
    }

    const chartData = data.map((row) => ({
        label: format(new Date(row.bucketStart), BUCKET_LABEL_FORMAT[period]),
        count: row.count,
    }))

    return (
        <div>
            <ResponsiveContainer width='100%' height={360}>
                <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 76, left: 8 }}>
                    <CartesianGrid vertical={false} stroke='var(--border)' />
                    <XAxis
                        dataKey='label'
                        tick={TICK_STYLE}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                        interval='preserveStartEnd'
                        label={{
                            value: 'Period',
                            position: 'bottom',
                            offset: 8,
                            style: { ...TICK_STYLE, textAnchor: 'middle' },
                        }}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={TICK_STYLE}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                        width={48}
                        label={{
                            value: 'Downloads',
                            angle: -90,
                            position: 'insideLeft',
                            style: { ...TICK_STYLE, textAnchor: 'middle' },
                        }}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(count) => [`${count} downloads`, undefined]}
                        cursor={{ stroke: 'var(--border)' }}
                    />
                    <Legend
                        verticalAlign='bottom'
                        align='center'
                        height={24}
                        wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)', paddingTop: 40 }}
                    />
                    <Bar
                        dataKey='count'
                        name='Downloads'
                        fill={C.c1}
                        radius={[3, 3, 0, 0]}
                        maxBarSize={28}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
