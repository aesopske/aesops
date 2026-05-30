'use client'

import type { ColumnStats } from '@repo/db/schema'
import { DTypeBadge } from '@/components/platform/dataset/dataset-card'
import { DatasetNumericChart } from '@/components/platform/dataset/dataset-numeric-chart'
import { DatasetCategoricalChart } from '@/components/platform/dataset/dataset-categorical-chart'
import { DatasetBooleanChart } from '@/components/platform/dataset/dataset-boolean-chart'

const COLUMN_LIMIT = 12

// datetime/empty/mixed columns don't produce meaningful charts
const CHARTABLE_DTYPES = new Set(['number', 'string', 'boolean'])

type Props = { columns: ColumnStats[]; rowCount: number }

export function DatasetChartGrid({ columns, rowCount }: Props) {
    const chartable = columns.filter((col) => {
        if (!CHARTABLE_DTYPES.has(col.dtype)) return false
        if (col.dtype === 'number') return col.mean !== undefined
        return (col.topValues?.length ?? 0) > 0
    })

    if (chartable.length === 0) return null

    const visible = chartable.slice(0, COLUMN_LIMIT)
    const overflow = chartable.length - COLUMN_LIMIT

    return (
        <div>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                {visible.map((col) => (
                    <div key={col.name} className='rounded-lg border border-border bg-muted/30 p-4'>
                        <div className='mb-3 flex items-center gap-1.5'>
                            <span className='truncate text-xs font-medium text-foreground'>{col.name}</span>
                            <DTypeBadge dtype={col.dtype} />
                        </div>
                        {col.dtype === 'boolean' ? (
                            <DatasetBooleanChart col={col} />
                        ) : col.mean !== undefined ? (
                            <DatasetNumericChart col={col} />
                        ) : (
                            <DatasetCategoricalChart col={col} totalRows={rowCount} />
                        )}
                    </div>
                ))}
            </div>
            {overflow > 0 && (
                <p className='mt-3 text-center text-xs text-muted-foreground'>
                    Showing {COLUMN_LIMIT} of {chartable.length} columns — see the column details table below for the rest.
                </p>
            )}
        </div>
    )
}
