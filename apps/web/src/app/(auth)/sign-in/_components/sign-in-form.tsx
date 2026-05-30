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

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function SignInForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [from] = useQueryState('from')

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '' },
    })

    function onSubmit(values: FormValues) {
        setError(null)
        startTransition(async () => {
            const { error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            })
            if (error) {
                setError(error.message ?? 'Sign in failed')
            } else {
                const redirect = from && from.startsWith('/') ? from : '/datasets'
                router.push(redirect)
                router.refresh()
            }
        })
    }

    return (
        <div className='space-y-4'>
            <GitHubSignInButton callbackURL={from && from.startsWith('/') ? from : '/datasets'} />

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
                        <p className='text-xs text-destructive'>{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className='space-y-1'>
                    <label htmlFor='password' className='block text-sm font-medium text-foreground'>
                        Password
                    </label>
                    <input
                        id='password'
                        type='password'
                        autoComplete='current-password'
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
                    {isPending ? 'Signing in…' : 'Sign in'}
                </button>
            </form>

            <p className='text-center text-sm text-muted-foreground'>
                No account?{' '}
                <Link href='/sign-up' className='font-medium text-foreground hover:underline'>
                    Create one
                </Link>
            </p>
        </div>
    )
}
