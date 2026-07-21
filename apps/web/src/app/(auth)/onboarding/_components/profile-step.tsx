'use client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-z0-9_-]+$/i, 'Letters, numbers, _ and - only'),
})

type FormValues = z.infer<typeof schema>

export function ProfileStep({ defaultName, onDone }: { defaultName: string; onDone: () => void }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: defaultName, username: '' },
    })

    function onSubmit(values: FormValues) {
        setError(null)
        startTransition(async () => {
            const { error } = await authClient.updateUser(values)
            if (error) {
                setError(error.message ?? 'Could not save your profile')
            } else {
                onDone()
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-1'>
                <label htmlFor='name' className='block text-sm font-medium text-foreground'>
                    Full name
                </label>
                <input
                    id='name'
                    type='text'
                    autoComplete='name'
                    {...form.register('name')}
                    className='block h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                />
                {form.formState.errors.name && (
                    <p className='text-xs text-destructive'>{form.formState.errors.name.message}</p>
                )}
            </div>

            <div className='space-y-1'>
                <label htmlFor='username' className='block text-sm font-medium text-foreground'>
                    Username
                </label>
                <input
                    id='username'
                    type='text'
                    autoComplete='username'
                    {...form.register('username')}
                    className='block h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                />
                {form.formState.errors.username && (
                    <p className='text-xs text-destructive'>{form.formState.errors.username.message}</p>
                )}
            </div>

            {error && <p className='text-sm text-destructive'>{error}</p>}

            <button
                type='submit'
                disabled={isPending}
                className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'>
                {isPending ? 'Saving…' : 'Continue'}
            </button>
        </form>
    )
}
