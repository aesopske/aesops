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
                className='h-8 w-8 md:h-8 md:w-auto xl:h-10'
                passHref>
                {/*<img
                    src='/aesops-logo-mark.svg'
                    alt='logo'
                    className='h-full w-auto'
                />*/}
                <SharedLogo className='h-full w-auto' />
            </Link>
        </div>
    )
}

export default Logo
