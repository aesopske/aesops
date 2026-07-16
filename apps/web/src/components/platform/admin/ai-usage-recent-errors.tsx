import { AlertCircle } from 'lucide-react'
import { timeAgo } from '@/lib/platform/format'
import { aiRouteLabel } from '@/lib/platform/ai-usage-labels'

export type AiUsageError = {
    id: string
    route: string
    model: string
    errorMessage: string | null
    createdAt: Date
}

export function AiUsageRecentErrors({ errors }: { errors: AiUsageError[] }) {
    if (errors.length === 0) {
        return (
            <p className='py-8 text-center text-sm text-muted-foreground'>
                No errors in this period.
            </p>
        )
    }

    return (
        <div className='overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
            <ul className='divide-y divide-border'>
                {errors.map((error) => (
                    <li key={error.id} className='flex items-start gap-3 px-4 py-3'>
                        <AlertCircle
                            size={14}
                            className='mt-0.5 shrink-0 text-destructive'
                        />
                        <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground'>
                                <span className='font-medium text-foreground'>
                                    {aiRouteLabel(error.route)}
                                </span>
                                <span>·</span>
                                <span>{error.model}</span>
                                <span>·</span>
                                <span>{timeAgo(error.createdAt)}</span>
                            </div>
                            <p className='mt-1 break-words text-sm text-foreground'>
                                {error.errorMessage ?? 'No error message recorded.'}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
