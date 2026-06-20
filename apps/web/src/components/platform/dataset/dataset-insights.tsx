'use client'

import { Sparkles } from 'lucide-react'
import { Streamdown } from 'streamdown'

type Props = {
    cachedInsights: string | null
}

export function DatasetInsights({ cachedInsights }: Props) {
    const hasResult = !!cachedInsights && cachedInsights.length > 0

    return (
        <div className='overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
            <div className='flex items-center gap-2 border-b border-border px-6 py-4'>
                <div className='flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent-foreground'>
                    <Sparkles size={13} />
                </div>
                <h2 className='font-medium text-foreground'>AI Insights</h2>
                <span className='rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-foreground'>
                    Gemini
                </span>
            </div>

            <div className='px-6 py-5'>
                {hasResult ? (
                    <div className='prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-li:my-0.5 prose-ul:my-1'>
                        <Streamdown mode='static'>{cachedInsights}</Streamdown>
                    </div>
                ) : (
                    <p className='text-sm text-muted-foreground'>
                        Insights are generated automatically when a dataset is uploaded or updated.
                    </p>
                )}
            </div>
        </div>
    )
}
