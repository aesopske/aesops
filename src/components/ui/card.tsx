import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = (
    {
        ref,
        className,
        ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
        ref: React.RefObject<HTMLDivElement>;
    }
) => (<div
    ref={ref}
    className={cn(
        'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-xs dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        className,
    )}
    {...props}
/>)
Card.displayName = 'Card'

const CardHeader = (
    {
        ref,
        className,
        ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
        ref: React.RefObject<HTMLDivElement>;
    }
) => (<div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
/>)
CardHeader.displayName = 'CardHeader'

const CardTitle = (
    {
        ref,
        className,
        ...props
    }: React.HTMLAttributes<HTMLHeadingElement> & {
        ref: React.RefObject<HTMLParagraphElement>;
    }
) => (<h3
    ref={ref}
    className={cn(
        'text-2xl font-semibold font-heading leading-none tracking-tight',
        className,
    )}
    {...props}
/>)
CardTitle.displayName = 'CardTitle'

const CardDescription = (
    {
        ref,
        className,
        ...props
    }: React.HTMLAttributes<HTMLParagraphElement> & {
        ref: React.RefObject<HTMLParagraphElement>;
    }
) => (<p
    ref={ref}
    className={cn(
        'text-sm font-sans text-slate-500 dark:text-slate-400',
        className,
    )}
    {...props}
/>)
CardDescription.displayName = 'CardDescription'

const CardContent = (
    {
        ref,
        className,
        ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
        ref: React.RefObject<HTMLDivElement>;
    }
) => (<div ref={ref} className={cn('p-6 pt-0', className)} {...props} />)
CardContent.displayName = 'CardContent'

const CardFooter = (
    {
        ref,
        className,
        ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
        ref: React.RefObject<HTMLDivElement>;
    }
) => (<div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
/>)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
