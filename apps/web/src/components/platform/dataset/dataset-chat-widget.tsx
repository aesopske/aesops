'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { DatasetChat } from './dataset-chat'

type StoredMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

type Props = {
    datasetId: string
    initialMessages?: StoredMessage[]
}

export function DatasetChatWidget({ datasetId, initialMessages }: Props) {
    const hasHistory = !!initialMessages?.length
    const [isOpen, setIsOpen] = useState(false)
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    )

    if (!mounted) return null

    return createPortal(
        <div
            className='fixed bottom-0 right-6 z-50 w-[520px]'
            style={{ filter: 'drop-shadow(0 -4px 24px rgb(0 0 0 / 0.12))' }}>
            {/* Trigger bar — always above the chat window */}
            <button
                onClick={() => setIsOpen((o) => !o)}
                className='w-full flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-t-xl transition-colors'>
                <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15'>
                    <Sparkles size={14} />
                </div>
                <span className='flex-1 text-left text-sm font-medium'>
                    Ask the data
                </span>
                {hasHistory && !isOpen && (
                    <span className='rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[11px] font-medium'>
                        {initialMessages.length}
                    </span>
                )}
                {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {/* Chat window — below the trigger bar */}
            <div
                className={`flex flex-col overflow-hidden border border-t-0 border-border bg-card transition-all duration-200 ease-in-out ${
                    isOpen
                        ? 'h-[600px] opacity-100'
                        : 'h-0 opacity-0 pointer-events-none'
                }`}>
                <DatasetChat
                    datasetId={datasetId}
                    initialMessages={initialMessages}
                    className='flex-1 min-h-0 rounded-none border-0 shadow-none'
                />
            </div>
        </div>,
        document.body,
    )
}
