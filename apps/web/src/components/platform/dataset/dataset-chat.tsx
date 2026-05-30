'use client'

import { useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { Streamdown } from 'streamdown'
import { SendHorizonal } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'

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

    const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } = useChat({
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

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent)
        }
    }

    return (
        <div className={cn('flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm', className)}>
            {/* messages */}
            <div ref={scrollRef} className='flex-1 min-h-0 overflow-y-auto px-6 py-5'>
                {messages.length === 0 ? (
                    <div className='flex h-full flex-col items-center justify-center gap-5 text-center'>
                        <div>
                            <p className='text-sm font-medium text-foreground'>
                                Ask anything about this dataset
                            </p>
                            <p className='mt-1 text-xs text-muted-foreground'>
                                Answers are grounded in the column schema and sample rows.
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
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                                        m.role === 'user'
                                            ? 'rounded-tr-sm bg-primary/10 text-foreground'
                                            : 'rounded-tl-sm bg-muted/60 text-foreground'
                                    }`}>
                                    {m.role === 'user' ? (
                                        <p className='whitespace-pre-wrap leading-relaxed'>
                                            {m.content}
                                        </p>
                                    ) : (
                                        <div className='prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-headings:font-medium'>
                                            <Streamdown mode='streaming'>{m.content}</Streamdown>
                                        </div>
                                    )}
                                </div>
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
                                                style={{ animationDelay: `${i * 0.15}s` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className='rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3'>
                                <p className='text-sm font-medium text-destructive'>Request failed</p>
                                <p className='mt-0.5 text-xs text-destructive/80'>{error.message}</p>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* input */}
            <div className='border-t border-border px-4 py-3'>
                <form onSubmit={handleSubmit} className='flex items-end gap-2.5'>
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Ask a question about this dataset…'
                        rows={1}
                        className='flex-1 resize-none rounded-lg border border-border bg-transparent px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                    />
                    <button
                        type='submit'
                        disabled={isLoading || !input.trim()}
                        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40'>
                        <SendHorizonal size={15} />
                    </button>
                </form>
                <p className='mt-2 text-[10px] text-muted-foreground'>
                    Based on column stats and sample rows · not the full dataset · Enter to send
                </p>
            </div>
        </div>
    )
}
