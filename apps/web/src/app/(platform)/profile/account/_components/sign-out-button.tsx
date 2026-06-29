'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
    const router = useRouter()

    async function handleSignOut() {
        await authClient.signOut()
        router.push('/')
    }

    return (
        <button
            onClick={handleSignOut}
            className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
            Sign out
        </button>
    )
}
