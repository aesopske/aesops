import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-sans',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-brandprimary-900 text-brandaccent-50 shadow hover:bg-brandprimary-800',
                secondary:
                    'border-transparent bg-brandaccent-50 text-brandprimary-700 hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

export type BadgeProps = {} & React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
