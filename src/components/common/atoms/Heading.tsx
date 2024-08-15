import { cva } from 'class-variance-authority'
import React, { createElement } from 'react'
import { cn } from '@/lib/utils'

const headingVariants = cva('tracking-tight font-heading', {
    variants: {
        type: {
            h1: 'text-3xl md:text-4xl font-black',
            h2: 'text-2xl md:text-3xl font-extrabold',
            h3: 'text-2xl font-bold',
            h4: 'text-xl font-semibold',
            h5: 'text-lg font-medium',
            h6: 'text-base font-normal',
        },
    },
    defaultVariants: {
        type: 'h1',
    },
})

type HeadingProps = {
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & React.HTMLProps<HTMLHeadingElement>

function Heading({ type = 'h1', className, ...props }: HeadingProps) {
    return createElement(type, {
        className: cn(headingVariants({ type, className })),
        ...props,
    })
}
export default Heading
