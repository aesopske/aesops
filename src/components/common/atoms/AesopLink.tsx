import React from 'react'
import Link, { LinkProps } from 'next/link'
import { cva } from 'class-variance-authority'

import { cn } from '@src/lib/utils'

type defaultProps = {
    type?: 'default' | 'button'
    variant?: 'default' | 'primary' | 'secondary' | 'dark'
    children: React.ReactNode
    className?: string
}

type ExternalProps = {
    isExternal: true
} & defaultProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement>

type InternalProps = {
    isExternal?: false
} & defaultProps &
    LinkProps

type AesopLinkProps = ExternalProps | InternalProps

const linkVariants = cva('font-sans transition-all duration-300', {
    variants: {
        type: {
            default:
                'hover:underline underline-offset-4 hover:decoration-dashed transition-all duration-300',
            button: 'inline-block w-fit rounded-full text-center py-3 px-6 hover:shadow-md',
        },
        variant: {
            default: 'text-aes-dark',
            primary: 'bg-aes-primary text-aes-light',
            secondary: 'bg-aes-secondary text-aes-dark',
            dark: 'bg-aes-dark text-aes-light',
        },
    },

    defaultVariants: {
        type: 'default',
        variant: 'default',
    },
})

function AesopLink({
    isExternal = false,
    children,
    className,
    variant,
    type,
    ...props
}: AesopLinkProps) {
    const { href, ...restProps } = props
    return isExternal ? (
        <a
            href={href?.toString()}
            className={cn(linkVariants({ variant, type }), className)}
            {...restProps}>
            {children}
        </a>
    ) : (
        <Link
            passHref
            href={href as string}
            className={cn(linkVariants({ variant, type }), className)}
            {...restProps}>
            {children}
        </Link>
    )
}
export default AesopLink
