import { cn } from '@src/lib/utils'
import React, { Fragment } from 'react'

type HasBackgroundWrapperProps = {} & React.HTMLAttributes<HTMLDivElement>

function HasBackgroundWrapper({
    children,
    className,
    ...props
}: HasBackgroundWrapperProps) {
    return (
        <div
            className={cn('relative h-auto w-full bg-aes-primary', className)}
            {...props}>
            <div className='absolute left-0 -top-24 w-32 h-32 rounded-full p-24 bg-brand-background'>
                <div className='absolute bg-aes-primary w-28 h-28 self-center rounded-full -translate-x-1/2 -translate-y-1/2'></div>
            </div>
            <Fragment>{children}</Fragment>
            <div className='absolute right-0 -bottom-24 w-32 h-32 rounded-full p-24 bg-brand-background'>
                <div className='relative bg-aes-primary w-28 h-28 self-center rounded-full -translate-x-1/2 -translate-y-1/2'></div>
            </div>
        </div>
    )
}
export default HasBackgroundWrapper
