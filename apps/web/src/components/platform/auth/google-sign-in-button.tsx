'use client'
import { useTransition } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { authClient } from '@/lib/auth-client'

type Props = {
    /** Where to send the user after a successful Google sign-in */
    callbackURL?: string
    label?: string
}

export function GoogleSignInButton({ callbackURL = '/', label = 'Continue with Google' }: Props) {
    const [isPending, startTransition] = useTransition()

    function handleClick() {
        startTransition(async () => {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL,
            })
        })
    }

    return (
        <button
            type='button'
            onClick={handleClick}
            disabled={isPending}
            className='flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50'
        >
            <FcGoogle className='h-4 w-4' />
            {isPending ? 'Redirecting…' : label}
        </button>
    )
}
