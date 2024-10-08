'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { Loader } from 'lucide-react'
import React from 'react'
import { subscribe } from '@src/app/_actions'
// import SubmitBtn from '../common/molecules/SubmitBtn'
import { Button } from '../ui'
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
    const ref = React.useRef<HTMLFormElement>(null)
    const emailRef = React.useRef<HTMLInputElement>(null)

    const [pending, setPending] = React.useState(false)
    const [email, setEmail] = React.useState('')

    return (
        <form
            ref={ref}
            className={dirVariants({ dir, className })}
            onSubmit={async (evt) => {
                evt.preventDefault()
                if (!emailRef.current?.value) return
                try {
                    setPending(true)
                    const response = await subscribe({
                        email: emailRef?.current?.value ?? '',
                    })

                    if (response?.data?.id) {
                        alert('Subscribed successfully! 🎉')
                        setEmail('')
                    }
                } catch (error) {
                    alert('An error occurred. Please try again later.')
                } finally {
                    setPending(false)
                }
            }}>
            <Input
                required
                name='email'
                type='email'
                ref={emailRef}
                value={email}
                onChange={(e) => {
                    if (!e.target.value) return
                    setEmail(e.target.value)
                }}
                id='subscription-email'
                placeholder='Enter your email'
                className='p-3 rounded-full flex-1'
            />

            <Button
                type='submit'
                disabled={pending || !email}
                className='bg-brandaccent-500 hover:bg-brandaccent-500/90  text-white p-2 px-6 rounded-full'>
                {pending ? (
                    <Loader size={20} className='animate-spin mr-2' />
                ) : null}
                Subscribe
            </Button>
        </form>
    )
}

export default SubscriptionForm
