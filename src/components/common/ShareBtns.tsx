'use client'

import React, { useEffect, useState } from 'react'
import { Check, Copy, Facebook, Twitter } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../ui'
import useCopy from '@src/hooks/useCopy'
import Heading from './atoms/Heading'

type ShareProps = {
    title: string
} & React.HTMLProps<HTMLDivElement>

function Share({ title, className }: ShareProps) {
    const [newUrl, setnewUrl] = useState('')
    const { copied, onCopy } = useCopy()

    useEffect(() => {
        if (typeof window !== undefined) {
            const url = window.location.href
            const encoded = encodeURIComponent(url)
            setnewUrl(encoded)
        }
    }, [])

    const shares = [
        {
            href: `https://www.facebook.com/sharer/sharer.php?u=${newUrl}&quote=${title}&display=page&caption=${title}`,
            icon: <Facebook className='w-full h-full' />,
            label: 'Facebook',
        },
        {
            href: `http://twitter.com/share?url=${newUrl}\n&text=${title}&hashtags=aesopske&via=Aesopsk`,
            icon: <Twitter className='w-full h-full' />,
            label: 'Twitter',
        },
        {
            href: `whatsapp://send?text=${newUrl} ${title}`,
            icon: <FaWhatsapp className='w-full h-full' />,
            label: 'Whatsapp',
        },
    ]

    return (
        <div className={cn('relative self-center space-y-2', className)}>
            <Heading type='h6' className='uppercase font-semibold'>
                Share:
            </Heading>
            <div className='flex gap-2 w-full'>
                {shares.map((share) => (
                    <a
                        title={share.label}
                        href={share.href}
                        key={share?.label}
                        target='_blank'
                        className={cn(
                            buttonVariants({
                                variant: 'outline',
                                className:
                                    'rounded-full border border-aes-dark/50 text-aes-dark hover:text-aes-light w-9 h-9 p-2 flex items-center justify-center',
                            })
                        )}
                        rel='noreferrer noopener'>
                        {share.icon}
                    </a>
                ))}
                <Button
                    title={`Copy ${title}`}
                    data-active={copied}
                    onClick={() => {
                        onCopy(decodeURIComponent(newUrl))
                    }}
                    variant='outline'
                    className='rounded-full border border-aes-dark/50 text-aes-dark hover:text-aes-light w-9 h-9 p-2 flex items-center justify-center data-[active=true]:bg-aes-dark data-[active=true]:text-aes-light'>
                    {copied ? (
                        <Check className='w-full h-full' />
                    ) : (
                        <Copy className='w-full h-full' />
                    )}
                </Button>
            </div>
        </div>
    )
}

export default Share
