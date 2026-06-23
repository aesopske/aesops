'use client'

import { BarChart, Bar, XAxis, YAxis, LabelList, Tooltip, ResponsiveContainer } from 'recharts'
import type { ColumnStats } from '@repo/db/schema'
import { C, TOOLTIP_STYLE } from '@/lib/platform/chart-theme'
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

    const barHeight = 28
    const height = Math.min(data.length * barHeight + 24, 180)

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
                <BarChart data={data} layout='vertical' margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
                    <XAxis type='number' hide />
                    <YAxis dataKey='name' type='category' hide />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(count) => {
                            const n = count as number
                            return [`${n.toLocaleString()} (${totalRows > 0 ? ((n / totalRows) * 100).toFixed(1) : '?'}%)`, 'Count']
                        }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.full ?? ''}
                    />
                    <Bar dataKey='count' fill={C.c1} radius={[0, 3, 3, 0]} maxBarSize={18}>
                        <LabelList
                            dataKey='name'
                            position='insideLeft'
                            offset={6}
                            fill='var(--primary-foreground)'
                            fontSize={11}
                            fontWeight={500}
                        />
                        <LabelList
                            dataKey='count'
                            position='right'
                            fill='var(--muted-foreground)'
                            fontSize={11}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <DatasetCompletenessBar nullPercent={col.nullPercent} />
        </div>
    )
}
