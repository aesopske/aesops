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
        .max(32)
        .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, hyphens and underscores')
        .or(z.literal('')),
    bio: z.string().max(160, 'Bio must be 160 characters or less').or(z.literal('')),
    website: z.string().url('Enter a valid URL').or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

type Props = {
    user: {
        id: string
        name: string
        email: string
        username?: string | null
        bio?: string | null
        website?: string | null
        image?: string | null
    }
}

export function ProfileForm({ user }: Props) {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user.name,
            username: user.username ?? '',
            bio: user.bio ?? '',
            website: user.website ?? '',
        },
    })

    function onSubmit(values: FormValues) {
        setStatus(null)
        startTransition(async () => {
            const { error } = await authClient.updateUser({
                name: values.name,
                username: values.username || undefined,
                bio: values.bio || undefined,
                website: values.website || undefined,
            })
            if (error) {
                setStatus({ type: 'error', message: error.message ?? 'Failed to update profile' })
            } else {
                setStatus({ type: 'success', message: 'Profile updated' })
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <div className='space-y-1'>
                <label htmlFor='name' className='block text-sm font-medium text-foreground'>
                    Display name
                </label>
                <input
                    id='name'
                    type='text'
                    {...form.register('name')}
                    className='block w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50'
                />
                {form.formState.errors.name && (
                    <p className='text-xs text-destructive'>{form.formState.errors.name.message}</p>
                )}
            </div>

            <div className='space-y-1'>
                <label htmlFor='username' className='block text-sm font-medium text-foreground'>
                    Username
                </label>
                <div className='flex rounded-md border border-border shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50'>
                    <span className='flex items-center rounded-l-md border-r border-border bg-muted px-3 text-sm text-muted-foreground'>
                        @
                    </span>
                    <input
                        id='username'
                        type='text'
                        {...form.register('username')}
                        className='block w-full rounded-r-md bg-transparent px-3 py-2 text-sm focus:outline-none'
                    />
                </div>
                {form.formState.errors.username && (
                    <p className='text-xs text-destructive'>{form.formState.errors.username.message}</p>
                )}
            </div>

            <div className='space-y-1'>
                <label htmlFor='bio' className='block text-sm font-medium text-foreground'>
                    Bio <span className='font-normal text-muted-foreground'>(optional)</span>
                </label>
                <textarea
                    id='bio'
                    rows={3}
                    {...form.register('bio')}
                    className='block w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50'
                    placeholder='Tell others about yourself'
                />
                {form.formState.errors.bio && (
                    <p className='text-xs text-destructive'>{form.formState.errors.bio.message}</p>
                )}
            </div>

            <div className='space-y-1'>
                <label htmlFor='website' className='block text-sm font-medium text-foreground'>
                    Website <span className='font-normal text-muted-foreground'>(optional)</span>
                </label>
                <input
                    id='website'
                    type='url'
                    {...form.register('website')}
                    placeholder='https://example.com'
                    className='block w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50'
                />
                {form.formState.errors.website && (
                    <p className='text-xs text-destructive'>{form.formState.errors.website.message}</p>
                )}
            </div>

            {status && (
                <p className={`text-sm ${status.type === 'success' ? 'text-success' : 'text-destructive'}`}>
                    {status.message}
                </p>
            )}

            <button
                type='submit'
                disabled={isPending}
                className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50'>
                {isPending ? 'Saving…' : 'Save changes'}
            </button>
        </form>
    )
}
