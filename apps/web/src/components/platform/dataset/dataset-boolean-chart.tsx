'use client'

import type { ColumnStats } from '@repo/db/schema'
import { C } from '@/lib/platform/chart-theme'
import { DatasetCompletenessBar } from './dataset-completeness-bar'

const TRUE_VALUES = new Set(['true', 'True', 'TRUE', 'yes', 'Yes', 'YES', '1'])

type Props = { col: ColumnStats }

export function DatasetBooleanChart({ col }: Props) {
    if (!col.topValues?.length) return null

    const trueCount = col.topValues
        .filter((tv) => TRUE_VALUES.has(tv.value))
        .reduce((sum, tv) => sum + tv.count, 0)
    const falseCount = col.topValues
        .filter((tv) => !TRUE_VALUES.has(tv.value))
        .reduce((sum, tv) => sum + tv.count, 0)

    const total = trueCount + falseCount
    if (total === 0) return null

    const truePct = (trueCount / total) * 100

    return (
        <div className='space-y-2'>
            <div className='flex h-5 overflow-hidden rounded-md font-mono text-[10px] font-medium'>
                {truePct > 0 && (
                    <div
                        className='flex items-center justify-center text-white'
                        style={{ width: `${truePct}%`, background: C.c3 }}
                    >
                        {truePct > 20 && `${truePct.toFixed(0)}%`}
                    </div>
                )}
                {truePct < 100 && (
                    <div className='flex flex-1 items-center justify-center bg-muted text-muted-foreground'>
                        {100 - truePct > 20 && `${(100 - truePct).toFixed(0)}%`}
                    </div>
                )}
            </div>
            <div className='flex justify-between text-xs text-muted-foreground'>
                <span className='flex items-center gap-1.5'>
                    <span className='inline-block h-2 w-2 shrink-0 rounded-sm' style={{ background: C.c3 }} />
                    true · {trueCount.toLocaleString()}
                </span>
                <span className='flex items-center gap-1.5'>
                    false · {falseCount.toLocaleString()}
                    <span className='inline-block h-2 w-2 shrink-0 rounded-sm bg-muted-foreground/20' />
                </span>
            </div>
            <DatasetCompletenessBar nullPercent={col.nullPercent} />
        </div>
    )
}
