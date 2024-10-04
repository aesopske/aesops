import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'
import { Button } from '@components/ui/button'
import { Input } from '../ui/input'

const dirVariants = cva('flex', {
    variants: {
        dir: {
            row: 'flex-row space-x-4',
            column: 'flex-col space-y-4',
        },
    },
    defaultVariants: {
        dir: 'column',
    },
})

interface SubscriptionFormProps
    extends React.HTMLAttributes<HTMLFormElement>,
        VariantProps<typeof dirVariants> {
    dir?: 'row' | 'column'
}

function SubscriptionForm({ dir, className }: SubscriptionFormProps) {
    return (
        <form className={dirVariants({ dir, className })}>
            <Input
                type='email'
                placeholder='Enter your email'
                className='p-3 rounded-full flex-1'
            />
            <Button className='bg-brandaccent-500 text-white p-2 px-6 rounded-full'>
                Subscribe
            </Button>
        </form>
    )
}

export default SubscriptionForm
