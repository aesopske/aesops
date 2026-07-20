import { Slot as SlotPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground',
                destructive:
                    'border-transparent bg-destructive/10 text-destructive',
                outline: 'border-border text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

type BadgeVariants = VariantProps<typeof badgeVariants>

type BadgeProps = React.ComponentProps<'span'> &
    BadgeVariants & { asChild?: boolean }

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
    const Comp = asChild ? SlotPrimitive.Slot : 'span'

    return (
        <Comp
            data-slot='badge'
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge }
