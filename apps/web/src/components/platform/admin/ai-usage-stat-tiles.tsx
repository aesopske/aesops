import { formatCompactNumber, formatLatency } from '@/lib/platform/chart-theme'

export type AiUsageByRoute = {
    route: string
    requests: number
    successCount: number
    totalTokens: number
    avgLatencyMs: number
}

function StatTile({
    label,
    value,
    tone = 'default',
}: {
    label: string
    value: string
    tone?: 'default' | 'destructive'
}) {
    return (
        <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs text-muted-foreground'>{label}</p>
            <p
                className={`mt-1 text-2xl font-semibold ${
                    tone === 'destructive'
                        ? 'text-destructive'
                        : 'text-foreground'
                }`}>
                {value}
            </p>
        </div>
    )
}

export function AiUsageStatTiles({ byRoute }: { byRoute: AiUsageByRoute[] }) {
    const requests = byRoute.reduce((sum, r) => sum + r.requests, 0)
    const successCount = byRoute.reduce((sum, r) => sum + r.successCount, 0)
    const errorCount = requests - successCount
    const totalTokens = byRoute.reduce((sum, r) => sum + r.totalTokens, 0)
    const avgLatencyMs = requests
        ? byRoute.reduce((sum, r) => sum + r.avgLatencyMs * r.requests, 0) /
          requests
        : 0
    const successRate = requests ? (successCount / requests) * 100 : 0
    const errorRate = requests ? (errorCount / requests) * 100 : 0

    return (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
            <StatTile
                label='Requests'
                value={formatCompactNumber(requests, 1)}
            />
            <StatTile
                label='Success rate'
                value={requests ? `${successRate.toFixed(1)}%` : '—'}
            />
            <StatTile
                label='Errors'
                value={requests ? `${errorRate.toFixed(1)}%` : '—'}
                tone={errorCount > 0 ? 'destructive' : 'default'}
            />
            <StatTile
                label='Tokens used'
                value={formatCompactNumber(totalTokens, 1)}
            />
            <StatTile label='Avg latency' value={formatLatency(avgLatencyMs)} />
        </div>
    )
}
