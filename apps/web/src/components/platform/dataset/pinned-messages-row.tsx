'use client'

import { X } from 'lucide-react'
import { unpinMessage, usePinnedMessages } from '@/lib/platform/pinned-messages'

type Props = {
    datasetId: string
    onSelect: (messageId: string) => void
}

export function PinnedMessagesRow({ datasetId, onSelect }: Props) {
    const pinnedMessages = usePinnedMessages(datasetId)

    if (pinnedMessages.length === 0) return null

    return (
        <div className='flex flex-wrap gap-2 px-3 pb-2'>
            {pinnedMessages.map((message) => (
                <button
                    key={message.id}
                    type='button'
                    onClick={() => onSelect(message.id)}
                    className='group flex items-center gap-1.5 rounded-full border border-border bg-muted/40 py-1 pl-3 pr-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground'>
                    <span className='max-w-[160px] truncate'>
                        {message.content}
                    </span>
                    <span
                        role='button'
                        tabIndex={0}
                        aria-label='Unpin message'
                        onClick={(e) => {
                            e.stopPropagation()
                            unpinMessage(datasetId, message.id)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation()
                                e.preventDefault()
                                unpinMessage(datasetId, message.id)
                            }
                        }}
                        className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground'>
                        <X size={10} />
                    </span>
                </button>
            ))}
        </div>
    )
}
