import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

type LogoProps = {
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

function Logo({ className }: LogoProps) {
    return (
        <div className='flex lg:flex-1'>
            <a
                href='/'
                className={cn(
                    'h-10 w-10 md:h-10 md:w-auto xl:h-12',
                    className
                )}>
                <span className='sr-only'>Aesops</span>
                <Image
                    width={200}
                    height={200}
                    alt='Aesops Logo'
                    className='hidden h-full w-full md:block'
                    src='/logo.svg'
                />
                <Image
                    width={200}
                    height={200}
                    alt='Aesops Logo'
                    className='h-full w-full md:hidden'
                    src='/logo-mark.svg'
                />
            </a>
        </div>
    )
}
export default Logo
