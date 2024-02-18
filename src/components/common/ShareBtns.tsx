import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'

type ShareProps = {
    title: string
} & React.HTMLProps<HTMLDivElement>

function Share({ title, className }: ShareProps) {
    const [newUrl, setnewUrl] = useState(null)

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
            icon: <FaFacebook />,
            label: 'Facebook',
        },
        {
            href: `http://twitter.com/share?url=${newUrl}\n&text=${title}&hashtags=aesopske&via=Aesopsk`,
            icon: <FaTwitter />,
            label: 'Twitter',
        },
        {
            href: `whatsapp://send?text=${newUrl} ${title}`,
            icon: <FaWhatsapp />,
            label: 'Whatsapp',
        },
    ]

    return (
        <div className={cn('relative self-center', className)}>
            <div className='flex gap-2'>
                {shares.map((share) => (
                    <a
                        key={share.label}
                        className='h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 focus-within:border-2 transition-all duration-300 ease-in-out'
                        aria-label={`share on ${share.label}`}
                        target='_blank'
                        href={share.href}
                        rel='noopener noreferrer'>
                        {share.icon}
                    </a>
                ))}
            </div>
        </div>
    )
}

export default Share
