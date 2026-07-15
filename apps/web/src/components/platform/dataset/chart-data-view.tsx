'use client'

import { useState } from 'react'
import { Code2, Copy, Check } from 'lucide-react'
import useCopy from '@/hooks/useCopy'
import { CHAT_ACTION_BUTTON_CLASS } from '@/lib/platform/chat-action-button'

type Props = { json: string; title?: string; children: React.ReactNode }

export function ChartDataView({ json, title, children }: Props) {
    const [showJson, setShowJson] = useState(false)
    const { onCopy, copied } = useCopy()

    return (
        <div>
            {title && <h4 className='mb-3 text-sm font-medium text-foreground'>{title}</h4>}
            {showJson ? (
                <pre className='max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 font-mono text-xs text-foreground'>
                    {json}
                </pre>
            ) : (
                children
            )}
            <div className='mt-2 flex items-center justify-end gap-1.5'>
                <button
                    type='button'
                    onClick={() => setShowJson((v) => !v)}
                    title={showJson ? 'Hide data' : 'View data'}
                    aria-label={showJson ? 'Hide data' : 'View data'}
                    className={CHAT_ACTION_BUTTON_CLASS}>
                    <Code2 className='h-3 w-3' />
                </button>
                <button
                    type='button'
                    onClick={() => onCopy(json)}
                    title={copied ? 'Copied' : 'Copy'}
                    aria-label={copied ? 'Copied' : 'Copy'}
                    className={CHAT_ACTION_BUTTON_CLASS}>
                    {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
                </button>
            </div>
        </div>
    )
}
