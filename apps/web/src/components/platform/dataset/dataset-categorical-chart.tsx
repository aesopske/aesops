'use client'

import { BarChart, Bar, XAxis, YAxis, LabelList, Tooltip, ResponsiveContainer } from 'recharts'
import type { ColumnStats } from '@repo/db/schema'
import { C, TOOLTIP_STYLE } from '@/lib/platform/chart-theme'
import { DatasetCompletenessBar } from './dataset-completeness-bar'

const LABEL_MAX = 16
const PILL_MAX = 22

function truncate(s: string, max = LABEL_MAX) {
    return s.length > max ? `${s.slice(0, max)}…` : s
}

type Props = { col: ColumnStats; totalRows: number }

function HighCardinalityView({ col }: { col: ColumnStats }) {
    const raw: string[] = col.sampleValues?.length
        ? (col.sampleValues as string[])
        : (col.topValues ?? []).map((tv: { value: string; count: number }) => tv.value)
    const samples = raw.slice(0, 6)

    return (
        <div className='space-y-3'>
            <div className='flex items-baseline gap-1.5'>
                <span className='font-mono text-sm font-semibold text-foreground'>
                    {col.uniqueCount.toLocaleString()}
                </span>
                <span className='font-mono text-[10px] text-muted-foreground'>unique values</span>
            </div>
            {samples.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                    {samples.map((v, i) => (
                        <span
                            key={i}
                            title={String(v)}
                            className='inline-block max-w-[140px] truncate rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground'>
                            {truncate(String(v), PILL_MAX)}
                        </span>
                    ))}
                </div>
            )}
            <DatasetCompletenessBar nullPercent={col.nullPercent} />
        </div>
    )
}

function UniformDistributionView({ col }: { col: ColumnStats }) {
    const values = (col.topValues ?? []).map((tv: { value: string; count: number }) => tv.value)
    const countEach = col.topValues?.[0]?.count ?? 0

    return (
        <div className='space-y-3'>
            <div className='flex items-center gap-2'>
                <div className='flex items-baseline gap-1.5'>
                    <span className='font-mono text-sm font-semibold text-foreground'>
                        {col.uniqueCount.toLocaleString()}
                    </span>
                    <span className='font-mono text-[10px] text-muted-foreground'>categories</span>
                </div>
                <span className='font-mono text-[10px] text-muted-foreground'>·</span>
                <span className='font-mono text-[10px] text-muted-foreground'>
                    {countEach.toLocaleString()} each
                </span>
            </div>
            <div className='flex flex-wrap gap-1.5'>
                {values.map((v: string, i: number) => (
                    <span
                        key={i}
                        title={v}
                        className='inline-block max-w-[120px] truncate rounded bg-primary/8 px-2 py-0.5 font-mono text-[10px] text-primary'>
                        {truncate(v, PILL_MAX)}
                    </span>
                ))}
                {col.uniqueCount > values.length && (
                    <span className='inline-flex items-center rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground'>
                        +{(col.uniqueCount - values.length).toLocaleString()} more
                    </span>
                )}
            </div>
            <DatasetCompletenessBar nullPercent={col.nullPercent} />
        </div>
    )
}

export function DatasetCategoricalChart({ col, totalRows }: Props) {
    if (!col.topValues?.length) return null

    const isIdColumn = col.uniqueCount >= totalRows * 0.99
    const isLowCardinality = !isIdColumn && col.uniqueCount <= 5
    const firstCount = col.topValues[0]?.count ?? 0
    const isUniform = !isIdColumn && col.topValues.length > 1 &&
        (col.topValues as { value: string; count: number }[]).every((tv) => tv.count === firstCount)

    if (isIdColumn) return <HighCardinalityView col={col} />
    if (isUniform) return <UniformDistributionView col={col} />

    const data = (col.topValues as { value: string; count: number }[]).map((tv) => ({
        name: truncate(tv.value),
        count: tv.count,
        full: tv.value,
    }))

    const barHeight = 28
    const height = Math.min(data.length * barHeight + 24, 180)

    return (
        <div>
            {isLowCardinality && (
                <div className='mb-2'>
                    <span className='inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
                        low cardinality
                    </span>
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
