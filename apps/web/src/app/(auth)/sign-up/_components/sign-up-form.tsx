'use client'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { authClient } from '@/lib/auth-client'
import { GitHubSignInButton } from '@/components/platform/auth/github-sign-in-button'
import { GoogleSignInButton } from '@/components/platform/auth/google-sign-in-button'
import { sanitizeReturnTo } from '@/lib/platform/return-to'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export function SignUpForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [from] = useQueryState('from')
    const returnTo = sanitizeReturnTo(from, '/profile')

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', email: '', password: '' },
    })

    function onSubmit(values: FormValues) {
        setError(null)
        startTransition(async () => {
            const { error } = await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
            })
            if (error) {
                setError(error.message ?? 'Sign up failed')
            } else {
                router.push(returnTo)
                router.refresh()
            }
        })
    }

    return (
        <div className='space-y-4'>
            <div className='space-y-2'>
                <GoogleSignInButton callbackURL={returnTo} label='Sign up with Google' />
                <GitHubSignInButton callbackURL={returnTo} label='Sign up with GitHub' />
            </div>

            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-xs'>
                    <span className='bg-card px-2 text-muted-foreground'>or continue with email</span>
                </div>
            </div>

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
                        className='block h-11 w-full rounded-lg border border-border bg-transparent px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                    />
                    {form.formState.errors.name && (
                        <p className='text-xs text-destructive'>{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className='space-y-1'>
                    <label htmlFor='email' className='block text-sm font-medium text-foreground'>
                        Email
                    </label>
                    <input
                        id='email'
                        type='email'
                        autoComplete='email'
                        {...form.register('email')}
                        className='block h-11 w-full rounded-lg border border-border bg-transparent px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                    />
                    {form.formState.errors.email && (
                        <p className='text-xs text-destructive'>
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </div>

                <div className='space-y-1'>
                    <label htmlFor='password' className='block text-sm font-medium text-foreground'>
                        Password
                    </label>
                    <input
                        id='password'
                        type='password'
                        autoComplete='new-password'
                        {...form.register('password')}
                        className='block h-11 w-full rounded-lg border border-border bg-transparent px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                    />
                    {form.formState.errors.password && (
                        <p className='text-xs text-destructive'>
                            {form.formState.errors.password.message}
                        </p>
                    )}
                </div>

                {error && <p className='text-sm text-destructive'>{error}</p>}

                <button
                    type='submit'
                    disabled={isPending}
                    className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'>
                    {isPending ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className='text-center text-sm text-muted-foreground'>
                Already have an account?{' '}
                <Link href='/sign-in' className='font-medium text-foreground hover:underline'>
                    Sign in
                </Link>
            </p>
        </div>
    )
}
