import React from 'react'
import Link from 'next/link'
import { Logo as SharedLogo } from '@repo/ui/components/logo'
import { cn } from '@/lib/utils'

type LogoProps = {
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

function Logo({ className, ...props }: LogoProps) {
    return (
        <div className={cn('flex lg:flex-1', className)} {...props}>
            <Link
                href='/'
                className='h-10 w-10 md:h-10 md:w-auto xl:h-12'
                passHref>
                <SharedLogo className='h-full w-auto' />
            </Link>
        </div>
    )
}

export default Logo
