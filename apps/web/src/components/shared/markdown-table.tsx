'use client'

import { useState, type ComponentProps } from 'react'
import { Maximize2, Copy, Check, Download } from 'lucide-react'
import {
    TableCopyDropdown,
    TableDownloadDropdown,
} from 'streamdown'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@repo/ui/components/dialog'
import { cn } from '@repo/ui/lib/utils'
import { CHAT_ACTION_BUTTON_CLASS } from '@/lib/platform/chat-action-button'

type Props = ComponentProps<'table'> & { node?: unknown }

export function MarkdownTable({
    children,
    className,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from the DOM spread below
    node,
    ...props
}: Props) {
    const [expanded, setExpanded] = useState(false)
    const [copied, setCopied] = useState(false)

    return (
        <div
            data-streamdown='table-wrapper'
            className='not-prose relative my-4 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm'>
            <div className='overflow-x-auto rounded-lg border border-border bg-background'>
                <table
                    className={cn('w-full divide-y divide-border', className)}
                    {...props}>
                    {children}
                </table>
            </div>
            <div className='mt-2 flex items-center justify-end gap-1.5'>
                <TableCopyDropdown
                    className={CHAT_ACTION_BUTTON_CLASS}
                    onCopy={() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 1500)
                    }}>
                    {copied ? (
                        <Check className='h-3 w-3' />
                    ) : (
                        <Copy className='h-3 w-3' />
                    )}
                </TableCopyDropdown>
                <TableDownloadDropdown className={CHAT_ACTION_BUTTON_CLASS}>
                    <Download className='h-3 w-3' />
                </TableDownloadDropdown>
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
                <DialogContent className='w-[90vw] max-w-4xl sm:max-w-4xl'>
                    <DialogTitle className='sr-only'>
                        Expanded table
                    </DialogTitle>
                    <div className='mt-6 max-h-[75vh] overflow-auto rounded-lg border border-border bg-background'>
                        <table className='w-full divide-y divide-border'>
                            {children}
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
