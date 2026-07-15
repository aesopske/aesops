'use client'

import { useState } from 'react'
import { trpc } from '@/trpc/react'
import {
    DownloadTrendChart,
    type DownloadPeriod,
} from '@/components/shared/download-trend-chart'

const PERIODS: { value: DownloadPeriod; label: string }[] = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'year', label: 'Yearly' },
]

export function DownloadAnalytics({ documentId }: { documentId: string }) {
    const [period, setPeriod] = useState<DownloadPeriod>('day')
    const { data, isLoading } = trpc.documents.downloadStats.useQuery({
        documentId,
        period,
    })

    return (
        <div>
            <div className='mb-4 inline-flex rounded-lg bg-muted p-1'>
                {PERIODS.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => setPeriod(p.value)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            period === p.value
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}>
                        {p.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                    Loading…
                </p>
            ) : (
                <DownloadTrendChart data={data ?? []} period={period} />
            )}
        </div>
    )
}
