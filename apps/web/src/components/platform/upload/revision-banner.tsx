'use client'

import { Info } from 'lucide-react'
import Link from 'next/link'

type Props = {
    parent: { id: string; name: string }
    className?: string
}

export function RevisionBanner({ parent, className }: Props) {
    return (
        <div
            className={`flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/8 px-4 py-3 text-sm ${className ?? ''}`}
        >
            <Info size={15} className='shrink-0 text-primary' />
            <span className='text-foreground'>
                Uploading revision of{' '}
                <Link
                    href={`/datasets/${parent.id}`}
                    className='font-medium text-primary underline-offset-2 hover:underline'
                >
                    {parent.name}
                </Link>
            </span>
        </div>
    )
}
