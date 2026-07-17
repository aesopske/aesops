'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Streamdown, type CustomRenderer } from 'streamdown'
import { SendHorizonal, RotateCcw, Copy, Check, Pin, PinOff } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'
import { DatasetChartBlock } from '@/components/platform/dataset/dataset-chart-block'
import { DatasetChatLoading } from '@/components/platform/dataset/dataset-chat-loading'
import { MarkdownTable } from '@/components/shared/markdown-table'
import { PinnedMessagesRow } from '@/components/platform/dataset/pinned-messages-row'
import {
    PINNED_MESSAGES_LIMIT,
    pinMessage,
    unpinMessage,
    usePinnedMessages,
} from '@/lib/platform/pinned-messages'
import { CHAT_ACTION_BUTTON_CLASS } from '@/lib/platform/chat-action-button'

const CHART_RENDERERS: CustomRenderer[] = [
    { component: DatasetChartBlock, language: 'chart' },
]

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    function handleCopy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        })
    }

    return (
        <button
            type='button'
            onClick={handleCopy}
            title={copied ? 'Copied' : 'Copy'}
            aria-label={copied ? 'Copied' : 'Copy'}
            className={CHAT_ACTION_BUTTON_CLASS}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
    )
}

function PinButton({
    pinned,
    disabled,
    onToggle,
}: {
    pinned: boolean
    disabled: boolean
    onToggle: () => void
}) {
    const label = disabled
        ? `You can only pin up to ${PINNED_MESSAGES_LIMIT} messages`
        : pinned
          ? 'Unpin message'
          : 'Pin message'

    return (
        <button
            type='button'
            onClick={onToggle}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={CHAT_ACTION_BUTTON_CLASS}>
            {pinned ? <PinOff size={12} /> : <Pin size={12} />}
        </button>
    )
}

const STARTER_QUESTIONS = [
    'What is this dataset about?',
    'Which columns have the most missing data?',
    'What patterns stand out in the data?',
    'What questions could this dataset help answer?',
]

type StoredMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

type Props = {
    datasetId: string
    initialMessages?: StoredMessage[]
    suggestedQuestions?: string[]
    className?: string
}

export function DatasetChat({
    datasetId,
    initialMessages,
    suggestedQuestions,
    className,
}: Props) {
    const starterQuestions = suggestedQuestions?.length
        ? suggestedQuestions
        : STARTER_QUESTIONS
    const scrollRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const messageRefs = useRef(new Map<string, HTMLDivElement>())
    const [highlightedId, setHighlightedId] = useState<string | null>(null)

    const pinnedMessages = usePinnedMessages(datasetId)
    const pinnedIds = useMemo(
        () => new Set(pinnedMessages.map((m) => m.id)),
        [pinnedMessages],
    )

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        append,
        setInput,
    } = useChat({
        api: '/api/ai/chat',
        body: { datasetId },
        initialMessages,
    })

    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [messages])

    function handleStarterClick(question: string) {
        append({ role: 'user', content: question })
    }

    function handleTogglePin(m: { id: string; role: 'user' | 'assistant'; content: string }) {
        if (pinnedIds.has(m.id)) {
            unpinMessage(datasetId, m.id)
        } else {
            pinMessage(datasetId, { id: m.id, role: m.role, content: m.content })
        }
    }

    function handleSelectPinned(messageId: string) {
        const el = messageRefs.current.get(messageId)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightedId(messageId)
        setTimeout(() => {
            setHighlightedId((current) => (current === messageId ? null : current))
        }, 1500)
    }

    function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        handleInputChange(e)
        const el = e.target
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent)
            if (textareaRef.current) textareaRef.current.style.height = 'auto'
        }
    }

    function handleFormSubmit(e: React.FormEvent) {
        handleSubmit(e)
        if (textareaRef.current) textareaRef.current.style.height = 'auto'
    }

    return (
        <div
            className={cn(
                'flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm',
                className,
            )}>
            {/* messages */}
            <div className='relative flex min-h-0 flex-1 flex-col'>
                <div
                    ref={scrollRef}
                    className='flex-1 min-h-0 overflow-y-auto px-6 py-5'>
                {messages.length === 0 ? (
                    <div className='flex h-full flex-col items-center justify-center gap-5 text-center'>
                        <div>
                            <p className='text-sm font-medium text-foreground'>
                                Ask anything about this dataset
                            </p>
                            <p className='mt-1 text-xs text-muted-foreground'>
                                Ask for exact counts, filtered rows, or a chart
                                — computed from the full dataset.
                            </p>
                        </div>
                        <div className='flex flex-wrap justify-center gap-2'>
                            {starterQuestions.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => handleStarterClick(q)}
                                    className='rounded-full border border-border bg-transparent px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground'>
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {messages
                            .filter((m) => m.content.trim())
                            .map((m) => {
                                const role: 'user' | 'assistant' =
                                    m.role === 'user' ? 'user' : 'assistant'
                                const pinned = pinnedIds.has(m.id)
                                const pinDisabled =
                                    !pinned &&
                                    pinnedMessages.length >=
                                        PINNED_MESSAGES_LIMIT
                                return (
                                    <div
                                        key={m.id}
                                        ref={(el) => {
                                            if (el)
                                                messageRefs.current.set(
                                                    m.id,
                                                    el,
                                                )
                                            else
                                                messageRefs.current.delete(
                                                    m.id,
                                                )
                                        }}
                                        className={`flex flex-col ${role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`rounded-2xl px-4 py-3 text-sm transition-shadow ${
                                                role === 'user'
                                                    ? 'max-w-[82%] rounded-tr-sm bg-primary/10 text-foreground'
                                                    : 'w-full rounded-tl-sm bg-muted/60 text-foreground'
                                            } ${
                                                highlightedId === m.id
                                                    ? 'ring-2 ring-primary/60'
                                                    : ''
                                            }`}>
                                            {role === 'user' ? (
                                                <p className='whitespace-pre-wrap leading-relaxed'>
                                                    {m.content}
                                                </p>
                                            ) : (
                                                <div className='prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-headings:font-medium'>
                                                    <Streamdown
                                                        mode='streaming'
                                                        isAnimating={
                                                            isLoading
                                                        }
                                                        plugins={{
                                                            renderers:
                                                                CHART_RENDERERS,
                                                        }}
                                                        components={{
                                                            table: MarkdownTable,
                                                        }}>
                                                        {m.content}
                                                    </Streamdown>
                                                </div>
                                            )}
                                        </div>
                                        <div className='mt-1 flex items-center gap-1.5'>
                                            {role === 'user' && (
                                                <>
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            setInput(
                                                                m.content,
                                                            )
                                                            textareaRef.current?.focus()
                                                        }}
                                                        title='Retry'
                                                        aria-label='Retry'
                                                        className={
                                                            CHAT_ACTION_BUTTON_CLASS
                                                        }>
                                                        <RotateCcw
                                                            size={12}
                                                        />
                                                    </button>
                                                </>
                                            )}
                                            <CopyButton text={m.content} />
                                            <PinButton
                                                pinned={pinned}
                                                disabled={pinDisabled}
                                                onToggle={() =>
                                                    handleTogglePin({
                                                        id: m.id,
                                                        role,
                                                        content: m.content,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            })}

                        {isLoading && <DatasetChatLoading />}

                        {error && (
                            <div className='rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3'>
                                <p className='text-sm font-medium text-destructive'>
                                    Request failed
                                </p>
                                <p className='mt-0.5 text-xs text-destructive/80'>
                                    {error.message}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                </div>
                <div className='pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card to-transparent' />
            </div>

            {/* input */}
            <PinnedMessagesRow
                datasetId={datasetId}
                onSelect={handleSelectPinned}
            />
            <form onSubmit={handleFormSubmit} className='p-3 pt-0'>
                <div className='flex items-end gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3.5 shadow-sm transition-colors focus-within:border-primary/40 focus-within:bg-card'>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Ask a question about this dataset…'
                        rows={1}
                        className='flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none'
                        style={{
                            minHeight: '52px',
                            maxHeight: '192px',
                            overflowY: 'auto',
                        }}
                    />
                    <button
                        type='submit'
                        disabled={isLoading || !input.trim()}
                        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40'>
                        <SendHorizonal size={14} />
                    </button>
                </div>
            </form>
        </div>
    )
}
