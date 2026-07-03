'use client'

import { useRef, useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Streamdown, type CustomRenderer } from 'streamdown'
import { SendHorizonal, RotateCcw, Copy, Check } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'
import { DatasetChartBlock } from '@/components/platform/dataset/dataset-chart-block'

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
            onClick={handleCopy}
            className='flex items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground'>
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copied' : 'Copy'}
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
    className?: string
}

export function DatasetChat({ datasetId, initialMessages, className }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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
                            {STARTER_QUESTIONS.map((q) => (
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
                            .map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm ${
                                            m.role === 'user'
                                                ? 'max-w-[82%] rounded-tr-sm bg-primary/10 text-foreground'
                                                : 'w-full rounded-tl-sm bg-muted/60 text-foreground'
                                        }`}>
                                        {m.role === 'user' ? (
                                            <p className='whitespace-pre-wrap leading-relaxed'>
                                                {m.content}
                                            </p>
                                        ) : (
                                            <div className='prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-headings:font-medium'>
                                                <Streamdown
                                                    mode='streaming'
                                                    isAnimating={isLoading}
                                                    plugins={{
                                                        renderers:
                                                            CHART_RENDERERS,
                                                    }}>
                                                    {m.content}
                                                </Streamdown>
                                            </div>
                                        )}
                                    </div>
                                    {m.role === 'user' && (
                                        <div className='mt-1 flex items-center gap-3'>
                                            <button
                                                onClick={() => {
                                                    setInput(m.content)
                                                    textareaRef.current?.focus()
                                                }}
                                                className='flex items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors hover:text-muted-foreground'>
                                                <RotateCcw size={10} />
                                                Retry
                                            </button>
                                            <CopyButton text={m.content} />
                                        </div>
                                    )}
                                </div>
                            ))}

                        {isLoading && (
                            <div className='flex justify-start'>
                                <div className='rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3.5'>
                                    <div className='flex items-center gap-1'>
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className='h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce'
                                                style={{
                                                    animationDelay: `${i * 0.15}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

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

            {/* input */}
            <form
                onSubmit={handleFormSubmit}
                className='border-t border-border rounded-t-xl'>
                <div className='relative px-4 pt-3 pb-1'>
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Ask a question about this dataset…'
                        rows={1}
                        className='w-full resize-none bg-transparent pr-11 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none'
                        style={{
                            minHeight: '28px',
                            maxHeight: '192px',
                            overflowY: 'auto',
                        }}
                    />
                    <button
                        type='submit'
                        disabled={isLoading || !input.trim()}
                        className='absolute bottom-2 right-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40'>
                        <SendHorizonal size={14} />
                    </button>
                </div>
                <p className='px-4 pb-3 text-[10px] text-muted-foreground'>
                    Counts and charts are computed live from the full dataset ·
                    Enter to send
                </p>
            </form>
        </div>
    )
}
