'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { trpc } from '@/trpc/react'
import { DATASET_CATEGORIES } from '@/lib/constants/dataset-taxonomy'
import { C, TOOLTIP_STYLE } from '@/lib/platform/chart-theme'

const CATEGORY_LABELS: Map<string, string> = new Map(
    DATASET_CATEGORIES.map((c) => [c.value, c.label]),
)
const CHART_COLORS = [C.c1, C.c2, C.c3, C.c4, C.c5]
const TOP_N = 6

export function CategoryBreakdownChart() {
    const { data, isLoading } = trpc.documents.categoryCounts.useQuery(undefined)

    if (isLoading || !data?.length) return null

    const chartData = data.slice(0, TOP_N).map((row: { category: string; count: number }) => ({
        label: CATEGORY_LABELS.get(row.category) ?? row.category,
        count: row.count,
    }))

    return (
        <div className='mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:mx-0'>
            <p className='mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
                Datasets by category
            </p>
            <ResponsiveContainer width='100%' height={chartData.length * 28}>
                <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                    <XAxis type='number' hide />
                    <YAxis
                        dataKey='label'
                        type='category'
                        axisLine={false}
                        tickLine={false}
                        width={140}
                        tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        cursor={{ fill: 'var(--muted)' }}
                        formatter={(count) => [`${count} datasets`, undefined]}
                    />
                    <Bar dataKey='count' radius={[0, 4, 4, 0]} maxBarSize={16}>
                        {chartData.map((_: { label: string; count: number }, i: number) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
