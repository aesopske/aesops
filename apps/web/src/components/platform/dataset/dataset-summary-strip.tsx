'use client'

import type { ColumnStats } from '@repo/db/schema'
import { C } from '@/lib/platform/chart-theme'

type DtypeFamily = 'numeric' | 'categorical' | 'boolean' | 'other'

function getDtypeFamily(dtype: string): DtypeFamily {
    if (dtype === 'number') return 'numeric'
    if (dtype === 'boolean') return 'boolean'
    if (dtype === 'empty') return 'other'
    return 'categorical'
}

const FAMILY_CLASSES: Record<DtypeFamily, string> = {
    numeric:     'bg-primary/10 text-primary',
    categorical: 'bg-muted text-muted-foreground',
    boolean:     'bg-success/10 text-success',
    other:       'bg-muted text-muted-foreground',
}

type Props = { columns: ColumnStats[] }

export function DatasetSummaryStrip({ columns }: Props) {
    if (columns.length === 0) return null

    const avgCompleteness =
        (columns.reduce((sum, col) => sum + (1 - col.nullPercent / 100), 0) / columns.length) * 100

    const counts: Record<DtypeFamily, number> = { numeric: 0, categorical: 0, boolean: 0, other: 0 }
    for (const col of columns) counts[getDtypeFamily(col.dtype)]++

    const families = (Object.keys(counts) as DtypeFamily[]).filter((k) => counts[k] > 0)

    return (
        <div className='space-y-4'>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                    <span className='font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground'>
                        Completeness
                    </span>
                    <span className='text-sm font-semibold text-foreground'>{avgCompleteness.toFixed(1)}%</span>
                </div>
                <div className='h-2 overflow-hidden rounded-full bg-muted'>
                    <div
                        className='h-full rounded-full'
                        style={{ width: `${avgCompleteness}%`, background: C.c1 }}
                    />
                </div>
            </div>

            <div className='flex flex-wrap gap-2'>
                {families.map((family) => (
                    <span
                        key={family}
                        className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] font-medium ${FAMILY_CLASSES[family]}`}
                    >
                        {counts[family]} {family}
                    </span>
                ))}
            </div>
        </div>
    )
}
