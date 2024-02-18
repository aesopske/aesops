import React, { createElement } from 'react'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

export const textVariants = cva('text-gray-900 tracking-normal', {
    variants: {
        variant: {
            default: 'text-gray-800',
            muted: 'text-gray-400',
            error: 'text-red-500',
            success: 'text-green-500',
            warning: 'text-aes-secondary',
            'brand-primary': 'text-aes-primary',
            'brand-secondary': 'text-aes-secondary',
            'brand-light': 'text-aes-light',
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
        },
    },
    defaultVariants: {
        variant: 'default',
        as: 'p',
    },
})

type TextProps = {
    as?: 'p' | 'span' | 'strong' | 'em' | 'small' | 'a' | 'li' | 'label'
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

function Text({ as = 'p', variant, className, children, ...props }: TextProps) {
    return createElement(
        as,
        {
            className: cn(textVariants({ variant }), className),
            ...props,
        },
        children
    )
}
export default Text
