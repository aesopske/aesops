'use client'

import { useCompletion } from 'ai/react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Streamdown } from 'streamdown'

type Props = {
    datasetId: string
    cachedInsights: string | null
}

export function DatasetInsights({ datasetId, cachedInsights }: Props) {
    const { completion, complete, isLoading, error } = useCompletion({
        api: '/api/ai/analyze',
        body: { id: datasetId },
    })

    const displayText = cachedInsights ?? completion
    const hasResult = displayText.length > 0

    return (
        <div className='overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
            <div className='flex items-center justify-between gap-2 border-b border-border px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent-foreground'>
                        <Sparkles size={13} />
                    </div>
                    <h2 className='font-medium text-foreground'>AI Insights</h2>
                    <span className='rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-foreground'>
                        Gemini
                    </span>
                </div>
                {!hasResult && !isLoading && (
                    <button
                        onClick={() => complete('')}
                        className='flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                        disabled={isLoading}>
                        <Sparkles size={13} />
                        Analyze
                    </button>
                )}
            </div>

            <div className='px-6 py-5'>
                {!hasResult && !isLoading && !error && (
                    <p className='text-sm text-muted-foreground'>
                        Get an AI-generated summary of this dataset — patterns, data quality, and
                        what questions it can answer.
                    </p>
                )}

                {isLoading && !hasResult && (
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Loader2 size={14} className='animate-spin' />
                        Analyzing dataset…
                    </div>
                )}

                {error && (
                    <div className='rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3'>
                        <p className='text-sm font-medium text-destructive'>Analysis failed</p>
                        <p className='mt-0.5 text-xs text-destructive/80'>{error.message}</p>
                    </div>
                )}

                {hasResult && (
                    <div className='prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-li:my-0.5 prose-ul:my-1'>
                        <Streamdown mode={isLoading ? 'streaming' : 'static'}>
                            {displayText}
                        </Streamdown>
                        {isLoading && (
                            <span className='inline-block h-4 w-1 animate-pulse rounded-sm bg-primary' />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
