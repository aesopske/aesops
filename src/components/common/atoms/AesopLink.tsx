import { cva } from 'class-variance-authority'
import React from 'react'
import Link, { LinkProps } from 'next/link'
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
                'hover:underline underline-offset-4 hover:decoration-dotted transition-all duration-300',
            button: 'inline-block w-fit rounded-full text-center py-3 px-6 hover:shadow-md text-sm',
        },
        variant: {
            default: 'text-brandprimary-900',
            primary: 'bg-brandprimary-700 text-brandaccent-50',
            secondary: 'bg-brandaccent-500 text-brandprimary-900',
            dark: 'bg-brandprimary-900 text-brandaccent-50 hover:opacity-90',
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
