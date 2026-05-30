'use client'

import { C } from '@/lib/platform/chart-theme'

type Props = { nullPercent: number }

export function DatasetCompletenessBar({ nullPercent }: Props) {
    if (nullPercent <= 0) return null
    const complete = 100 - nullPercent
    return (
        <div className='mt-2'>
            <div className='mb-0.5 flex justify-between font-mono text-[10px] text-muted-foreground'>
                <span>{complete.toFixed(1)}% complete</span>
                <span>{nullPercent.toFixed(1)}% null</span>
            </div>
            <div className='h-1 w-full overflow-hidden rounded-full bg-muted'>
                <div
                    className='h-full rounded-full'
                    style={{ width: `${complete}%`, background: C.c1 }}
                />
            </div>
        </div>
    )
}
