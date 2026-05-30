'use client'

import type { ColumnStats } from '@repo/db/schema'
import { C } from '@/lib/platform/chart-theme'
import { DatasetCompletenessBar } from './dataset-completeness-bar'

function fmt(v: number): string {
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}k`
    return Number.isInteger(v) ? String(v) : v.toFixed(2)
}

type Props = { col: ColumnStats }

export function DatasetNumericChart({ col }: Props) {
    const { min, max, mean, median, std, nullPercent } = col
    if (min === undefined || max === undefined) return null

    if (min === max) {
        return (
            <p className='text-xs text-muted-foreground'>
                Constant: <span className='font-medium text-foreground'>{fmt(min)}</span>
            </p>
        )
    }

    const range = max - min
    const pct = (v: number) =>
        `${Math.max(0, Math.min(100, ((v - min) / range) * 100)).toFixed(2)}%`

    const stdBandLeft =
        std !== undefined && mean !== undefined
            ? Math.max(0, Math.min(100, ((mean - std - min) / range) * 100))
            : null
    const stdBandRight =
        std !== undefined && mean !== undefined
            ? Math.max(0, Math.min(100, ((mean + std - min) / range) * 100))
            : null

    const skew =
        mean !== undefined && median !== undefined && range > 0
            ? (mean - median) / range
            : null
    const skewLabel =
        skew !== null && Math.abs(skew) > 0.1
            ? skew > 0
                ? 'right-skewed'
                : 'left-skewed'
            : null

    return (
        <div className='mt-1 space-y-3'>
            <div className='relative h-2 w-full rounded-full bg-muted'>
                <div className='absolute inset-0 rounded-full opacity-20' style={{ background: C.c1 }} />
                {stdBandLeft !== null && stdBandRight !== null && (
                    <div
                        className='absolute top-0 h-full rounded-sm opacity-40'
                        style={{
                            left: `${stdBandLeft}%`,
                            width: `${stdBandRight - stdBandLeft}%`,
                            background: C.c1,
                        }}
                    />
                )}
                {median !== undefined && (
                    <div
                        className='absolute top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-sm'
                        style={{ left: pct(median), background: C.c1 }}
                    />
                )}
                {mean !== undefined && (
                    <div
                        className='absolute top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-sm'
                        style={{ left: pct(mean), background: C.c2 }}
                    />
                )}
            </div>
            <div className='flex items-start justify-between gap-2 text-xs text-muted-foreground'>
                <span className='shrink-0 font-mono text-[11px]'>{fmt(min)}</span>
                <div className='flex flex-wrap justify-center gap-x-3 gap-y-1'>
                    {median !== undefined && (
                        <span className='flex items-center gap-1'>
                            <span className='inline-block h-2.5 w-0.5 rounded-sm' style={{ background: C.c1 }} />
                            med {fmt(median)}
                        </span>
                    )}
                    {mean !== undefined && (
                        <span className='flex items-center gap-1'>
                            <span className='inline-block h-2.5 w-0.5 rounded-sm' style={{ background: C.c2 }} />
                            avg {fmt(mean)}
                        </span>
                    )}
                    {skewLabel && (
                        <span className='rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-foreground'>
                            {skewLabel}
                        </span>
                    )}
                </div>
                <span className='shrink-0 font-mono text-[11px]'>{fmt(max)}</span>
            </div>
            <DatasetCompletenessBar nullPercent={nullPercent} />
        </div>
    )
}
