'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleSignOut() {
        startTransition(async () => {
            await authClient.signOut()
            router.push('/sign-in')
            router.refresh()
        })
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={isPending}
            className='text-sm text-muted-foreground hover:text-foreground disabled:opacity-50'>
            {isPending ? 'Signing out…' : 'Sign out'}
        </button>
    )
}
