'use client'

import { useState } from 'react'
import { trpc } from '@/trpc/react'
import { AiUsageStatTiles } from './ai-usage-stat-tiles'
import { AiUsageChart } from './ai-usage-chart'
import { AiUsageRouteBreakdown } from './ai-usage-route-breakdown'
import { AiUsageRecentErrors } from './ai-usage-recent-errors'
import { AiUsageSkeleton } from './ai-usage-skeleton'

const WINDOWS = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
] as const

export function AiUsageDashboard() {
    const [days, setDays] = useState<number>(30)
    const { data: byRoute, isLoading: loadingByRoute } =
        trpc.admin.aiUsage.byRoute.useQuery({ days })
    const { data: daily, isLoading: loadingDaily } =
        trpc.admin.aiUsage.daily.useQuery({ days })
    const { data: recentErrors, isLoading: loadingErrors } =
        trpc.admin.aiUsage.recentErrors.useQuery({ days, limit: 20 })

    const isLoading = loadingByRoute || loadingDaily || loadingErrors

    return (
        <div className='space-y-6'>
            <div className='inline-flex rounded-lg bg-muted p-1'>
                {WINDOWS.map((w) => (
                    <button
                        key={w.value}
                        onClick={() => setDays(w.value)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            days === w.value
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}>
                        {w.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <AiUsageSkeleton />
            ) : (
                <>
                    <AiUsageStatTiles byRoute={byRoute ?? []} />

                    <div className='rounded-xl border border-border bg-card p-4 shadow-sm'>
                        <h3 className='mb-1 text-sm font-medium text-foreground'>
                            Requests by day
                        </h3>
                        <AiUsageChart data={daily ?? []} />
                    </div>

                    <div>
                        <h3 className='mb-2 text-sm font-medium text-foreground'>
                            By route
                        </h3>
                        <AiUsageRouteBreakdown byRoute={byRoute ?? []} />
                    </div>

                    <div>
                        <h3 className='mb-2 text-sm font-medium text-foreground'>
                            Recent errors
                        </h3>
                        <AiUsageRecentErrors errors={recentErrors ?? []} />
                    </div>
                </>
            )}
        </div>
    )
}
