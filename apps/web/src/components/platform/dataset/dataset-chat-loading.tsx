'use client'

import { useEffect, useState } from 'react'

const LOADING_PHRASES = [
    'Thinking…',
    'Talking to the data…',
    'Querying the dataset…',
    'Crunching the numbers…',
    'Looking through the rows…',
    'Putting it together…',
]

const CYCLE_MS = 1800

export function DatasetChatLoading() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % LOADING_PHRASES.length)
        }, CYCLE_MS)
        return () => clearInterval(id)
    }, [])

    return (
        <div className='flex justify-start'>
            <div className='flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3.5'>
                <span className='h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-muted-foreground/50' />
                <span className='text-xs text-muted-foreground'>
                    {LOADING_PHRASES[index]}
                </span>
            </div>
        </div>
    )
}
