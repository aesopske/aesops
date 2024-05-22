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
            <div className='hidden absolute -left-5 -top-20 p-20  w-28 h-28  rounded-full bg-brand-background md:left-0 md:-top-24 md:w-32 md:h-32 md:p-24 md:block'>
                <div className='absolute bg-aes-primary h-24 w-24 self-center rounded-full -translate-x-1/2 -translate-y-1/2 md:w-28 md:h-28'></div>
            </div>
            <Fragment>{children}</Fragment>
            <div className='hidden absolute -right-5 -bottom-20 w-28 h-28 rounded-full p-20 bg-brand-background md:w-32 md:h-32 md:p-24 md:-bottom-24 md:right-0 md:block'>
                <div className='relative bg-aes-primary w-24 h-24 self-center rounded-full -translate-x-1/2 -translate-y-1/2 md:w-28 md:h-28'></div>
            </div>
        </div>
    )
}
export default HasBackgroundWrapper
