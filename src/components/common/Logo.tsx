import React from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

type LogoProps = {
    variant?: 'default' | 'small'
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

function Logo({ variant = 'default', className }: LogoProps) {
    return (
        <div className='flex lg:flex-1'>
            <a href='/' className={cn('-m-1.5 p-1.5', className)}>
                <span className='sr-only'>Aesops</span>
                <Image
                    width={200}
                    height={200}
                    alt='Aesops Logo'
                    className='h-10 w-auto'
                    src={variant === 'small' ? '/logo-small.svg' : '/logo.svg'}
                />
            </a>
        </div>
    )
}
export default Logo
