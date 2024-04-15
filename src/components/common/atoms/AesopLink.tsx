import React from 'react'
import Link, { LinkProps } from 'next/link'
import { cva } from 'class-variance-authority'

import { cn } from '@src/lib/utils'

type defaultProps = {
    variant?: 'default' | 'button'
    color?: 'default' | 'primary' | 'secondary' | 'dark'
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
        variant: {
            default:
                'hover:underline underline-offset-4 hover:decoration-dashed transition-all duration-300',
            button: 'inline-block w-fit rounded-full text-center py-3 px-6 hover:shadow-md',
        },
        color: {
            default: 'text-aes-dark',
            primary: 'bg-aes-primary text-aes-light',
            secondary: 'bg-aes-secondary text-aes-dark',
            dark: 'bg-aes-dark text-aes-light',
        },
    },

    defaultVariants: {
        variant: 'default',
        color: 'default',
    },
})

function AesopLink({
    isExternal,
    children,
    className,
    variant,
    color,
    ...props
}: AesopLinkProps) {
    const { href, ...restProps } = props
    return isExternal ? (
        <a
            href={href?.toString()}
            className={cn(linkVariants({ variant, color }), className)}
            {...restProps}>
            {children}
        </a>
    ) : (
        <Link
            {...props}
            className={cn(linkVariants({ variant, color }), className)}>
            {children}
        </Link>
    )
}
export default AesopLink
