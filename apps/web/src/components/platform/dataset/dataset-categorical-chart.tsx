'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ColumnStats } from '@repo/db/schema'
import { C, TOOLTIP_STYLE, TICK_STYLE } from '@/lib/platform/chart-theme'
import { DatasetCompletenessBar } from './dataset-completeness-bar'

const LABEL_MAX = 16

function truncate(s: string) {
    return s.length > LABEL_MAX ? `${s.slice(0, LABEL_MAX)}…` : s
}

type Props = { col: ColumnStats; totalRows: number }

export function DatasetCategoricalChart({ col, totalRows }: Props) {
    if (!col.topValues?.length) return null

    const isIdColumn = col.uniqueCount >= totalRows * 0.99
    const isLowCardinality = !isIdColumn && col.uniqueCount <= 5

    const data = col.topValues.map((tv) => ({
        name: truncate(tv.value),
        count: tv.count,
        full: tv.value,
    }))

    const height = Math.min(col.topValues.length * 32 + 24, 180)

    return (
        <div>
            {(isIdColumn || isLowCardinality) && (
                <div className='mb-2 flex gap-1.5'>
                    {isIdColumn && (
                        <span className='inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
                            ID column
                        </span>
                    )}
                    {isLowCardinality && (
                        <span className='inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
                            low cardinality
                        </span>
                    )}
                </div>
            )}
            <ResponsiveContainer width='100%' height={height}>
                <BarChart data={data} layout='vertical' margin={{ top: 4, right: 8, bottom: 4, left: 4 }}>
                    <XAxis type='number' tick={TICK_STYLE} axisLine={false} tickLine={false} />
                    <YAxis
                        type='category'
                        dataKey='name'
                        width={110}
                        tick={TICK_STYLE}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Bar dataKey='count' fill={C.c1} radius={[0, 3, 3, 0]} maxBarSize={18} />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(count) => {
                            const n = count as number
                            return [`${n.toLocaleString()} (${totalRows > 0 ? ((n / totalRows) * 100).toFixed(1) : '?'}%)`, 'Count']
                        }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ''}
                    />
                </BarChart>
            </ResponsiveContainer>
            <DatasetCompletenessBar nullPercent={col.nullPercent} />
        </div>
    )
}
