import { cva } from 'class-variance-authority'
import React, { createElement, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const textVariants = cva('text-gray-900 tracking-normal font-sans', {
    variants: {
        variant: {
            default: 'text-gray-800',
            muted: 'text-gray-400',
            error: 'text-red-500',
            success: 'text-green-500',
            warning: 'text-brandaccent-500',
            'brand-primary': 'text-brandprimary-700',
            'brand-secondary': 'text-brandaccent-500',
            'brand-light': 'text-brandaccent-50',
        },
        as: {
            p: 'text-base font-normal',
            span: 'text-base font-normal',
            strong: 'text-base font-bold',
            em: 'text-base font-italic',
            small: 'text-sm font-normal',
            a: 'text-base font-normal',
            li: 'text-base font-normal',
            label: 'text-base font-normal',
            pre: 'text-sm font-normal font-mono whitespace-pre-wrap',
        },
    },
    defaultVariants: {
        variant: 'default',
        as: 'p',
    },
})

type TextProps = {
    as?: 'p' | 'span' | 'strong' | 'em' | 'small' | 'a' | 'li' | 'label' | 'pre'
    variant?:
        | 'default'
        | 'muted'
        | 'error'
        | 'success'
        | 'warning'
        | 'brand-primary'
        | 'brand-secondary'
        | 'brand-light'
} & React.HTMLProps<HTMLParagraphElement>

function Text(props: TextProps, ref: React.Ref<HTMLParagraphElement>) {
    const { as = 'p', variant, className, children, ...rest } = props
    return createElement(
        as,
        {
            ref,
            className: cn(textVariants({ variant }), className),
            ...rest,
        },
        children,
    )
}
export default forwardRef(Text)
