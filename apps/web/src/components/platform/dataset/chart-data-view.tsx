'use client'

import { useState } from 'react'
import { Code2, Copy, Check, Maximize2 } from 'lucide-react'
import useCopy from '@/hooks/useCopy'
import { CHAT_ACTION_BUTTON_CLASS } from '@/lib/platform/chat-action-button'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@repo/ui/components/dialog'

type Props = {
    json: string
    title?: string
    children: React.ReactNode | ((height: number | string) => React.ReactNode)
}

export function ChartDataView({ json, title, children }: Props) {
    const [showJson, setShowJson] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const { onCopy, copied } = useCopy()

    const renderChart = (height: number | string) =>
        typeof children === 'function' ? children(height) : children

    return (
        <div>
            {title && <h4 className='mb-3 text-sm font-medium text-foreground'>{title}</h4>}
            {showJson ? (
                <pre className='max-h-64 overflow-auto rounded-lg bg-muted/40 p-3 font-mono text-xs text-foreground'>
                    {json}
                </pre>
            ) : (
                renderChart(256)
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
                <button
                    type='button'
                    onClick={() => setExpanded(true)}
                    title='Expand'
                    aria-label='Expand'
                    className={CHAT_ACTION_BUTTON_CLASS}>
                    <Maximize2 className='h-3 w-3' />
                </button>
            </div>

            <Dialog open={expanded} onOpenChange={setExpanded}>
                <DialogContent
                    showCloseButton
                    className='flex h-[90vh] w-[95vw] max-w-[95vw] flex-col gap-3 p-6 sm:max-w-[95vw]'>
                    <DialogTitle className='shrink-0 text-base font-medium text-foreground'>
                        {title ?? 'Chart'}
                    </DialogTitle>
                    <div className='min-h-0 flex-1'>{renderChart('100%')}</div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
