'use client'

import React from 'react'
import Link, { LinkProps } from 'next/link'
import { cva } from 'class-variance-authority'
import { cn } from '@src/lib/utils'
import { buttonVariants } from '@src/components/ui'

type AesopLinkProps = {
    isExternal?: boolean
    variant?: 'default' | 'button'
    buttonType?: 'secondary' | 'link'
} & React.HTMLAttributes<HTMLAnchorElement> &
    LinkProps

const linkVariants = cva('', {
    variants: {
        variant: {
            default: 'underline underline-offset-8 hover:decoration-dashed',
            button: buttonVariants({ variant: 'default' }),
        },
        buttonType: {
            // primary: buttonVariants({ variant: 'primary' }),
            secondary: buttonVariants({ variant: 'secondary' }),
            link: buttonVariants({ variant: 'link' }),
        },
    },

    defaultVariants: {
        variant: 'default',
        buttonType: 'secondary',
    },
})

function AesopLink({
    isExternal,
    children,
    className,
    variant,
    buttonType,
    ...props
}: AesopLinkProps) {
    const { href, ...restProps } = props
    return isExternal ? (
        <a
            href={href.toString()}
            className={cn(linkVariants({ variant, buttonType }), className)}
            {...restProps}>
            {children}
        </a>
    ) : (
        <Link
            {...props}
            className={cn(linkVariants({ variant, buttonType }), className)}>
            {children}
        </Link>
    )
}
export default AesopLink
