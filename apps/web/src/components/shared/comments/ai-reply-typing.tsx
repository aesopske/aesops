'use client'

import { useEffect, useState } from 'react'

const PHRASES = ['Thinking…', 'Reading the thread…', 'Drafting a reply…']

const CYCLE_MS = 1800

export function AiReplyTyping() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % PHRASES.length)
        }, CYCLE_MS)
        return () => clearInterval(id)
    }, [])

    return (
        <div className='mt-3 flex items-center gap-2 pl-10'>
            <span className='flex items-center gap-0.5'>
                <span
                    className='h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50'
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className='h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50'
                    style={{ animationDelay: '200ms' }}
                />
                <span
                    className='h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50'
                    style={{ animationDelay: '400ms' }}
                />
            </span>
            <span className='text-xs text-muted-foreground'>
                {PHRASES[index]}
            </span>
        </div>
    )
}
