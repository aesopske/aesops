import { formatCompactNumber, formatLatency } from '@/lib/platform/chart-theme'
import { aiRouteLabel } from '@/lib/platform/ai-usage-labels'
import type { AiUsageByRoute } from './ai-usage-stat-tiles'

export function AiUsageRouteBreakdown({
    byRoute,
}: {
    byRoute: AiUsageByRoute[]
}) {
    if (byRoute.length === 0) {
        return (
            <p className='py-8 text-center text-sm text-muted-foreground'>
                No AI usage in this period.
            </p>
        )
    }

    return (
        <div className='overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
            <table className='w-full text-sm'>
                <thead>
                    <tr className='border-b border-border bg-muted/40 text-left text-xs text-muted-foreground'>
                        <th className='px-4 py-2 font-medium'>Route</th>
                        <th className='px-4 py-2 font-medium'>Requests</th>
                        <th className='px-4 py-2 font-medium'>Success rate</th>
                        <th className='px-4 py-2 font-medium'>Errors</th>
                        <th className='px-4 py-2 font-medium'>Tokens</th>
                        <th className='px-4 py-2 font-medium'>Avg latency</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                    {byRoute.map((row) => {
                        const errorCount = row.requests - row.successCount
                        return (
                            <tr key={row.route}>
                                <td className='px-4 py-2.5 font-medium text-foreground'>
                                    {aiRouteLabel(row.route)}
                                </td>
                                <td className='px-4 py-2.5 tabular-nums text-muted-foreground'>
                                    {formatCompactNumber(row.requests, 1)}
                                </td>
                                <td className='px-4 py-2.5 tabular-nums text-muted-foreground'>
                                    {row.requests
                                        ? `${((row.successCount / row.requests) * 100).toFixed(1)}%`
                                        : '—'}
                                </td>
                                <td
                                    className={`px-4 py-2.5 tabular-nums ${
                                        errorCount > 0
                                            ? 'text-destructive'
                                            : 'text-muted-foreground'
                                    }`}>
                                    {errorCount}
                                </td>
                                <td className='px-4 py-2.5 tabular-nums text-muted-foreground'>
                                    {formatCompactNumber(row.totalTokens, 1)}
                                </td>
                                <td className='px-4 py-2.5 tabular-nums text-muted-foreground'>
                                    {formatLatency(row.avgLatencyMs)}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
