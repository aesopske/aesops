'use client'

import { useState } from 'react'
import { Code2, Copy, Check } from 'lucide-react'
import useCopy from '@/hooks/useCopy'

type Props = { json: string; title?: string; children: React.ReactNode }

const BUTTON_CLASS =
    'flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'

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
            <div className='mt-2 flex items-center justify-end gap-1'>
                <button onClick={() => setShowJson((v) => !v)} className={BUTTON_CLASS}>
                    <Code2 className='h-3 w-3' />
                    {showJson ? 'Hide data' : 'View data'}
                </button>
                <button onClick={() => onCopy(json)} className={BUTTON_CLASS}>
                    {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        </div>
    )
}
