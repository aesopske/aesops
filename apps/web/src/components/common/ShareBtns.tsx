'use client'

import { Check, Copy, Twitter } from 'lucide-react'
import { FaWhatsapp, FaLinkedinIn } from 'react-icons/fa'
import React, { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import useCopy from '@/hooks/useCopy'

type ShareProps = {
    title: string
} & React.HTMLProps<HTMLDivElement>

function Share({ title, className }: ShareProps) {
    const newUrl = useSyncExternalStore(
        () => () => {},
        () => encodeURIComponent(window.location.href),
        () => '',
    )
    const { copied, onCopy } = useCopy()

    const shares = [
        {
            href: `http://twitter.com/share?url=${newUrl}&text=${title}&hashtags=aesopske&via=Aesopsk`,
            icon: <Twitter className='w-3.5 h-3.5' />,
            label: 'Twitter / X',
        },
        {
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${newUrl}`,
            icon: <FaLinkedinIn className='w-3.5 h-3.5' />,
            label: 'LinkedIn',
        },
        {
            href: `whatsapp://send?text=${newUrl} ${title}`,
            icon: <FaWhatsapp className='w-3.5 h-3.5' />,
            label: 'WhatsApp',
        },
    ]

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <span className='text-[10px] font-mono font-medium tracking-[0.18em] uppercase text-muted-foreground'>
                Share
            </span>
            <div className='flex items-center gap-1.5'>
                {shares.map((share) => (
                    <a
                        key={share.label}
                        title={share.label}
                        href={share.href}
                        target='_blank'
                        rel='noreferrer noopener'
                        className='w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/4 transition-all duration-200'>
                        {share.icon}
                    </a>
                ))}
                <button
                    title={`Copy link`}
                    onClick={() => onCopy(decodeURIComponent(newUrl))}
                    className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/4 transition-all duration-200',
                        copied && 'border-primary/40 bg-primary/4 text-primary',
                    )}>
                    {copied ? (
                        <Check className='w-3.5 h-3.5' />
                    ) : (
                        <Copy className='w-3.5 h-3.5' />
                    )}
                </button>
            </div>
        </div>
    )
}

export default Share
