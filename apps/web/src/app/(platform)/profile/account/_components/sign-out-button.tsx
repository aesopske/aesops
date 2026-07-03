'use client'

import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
    const router = useRouter()
    const pathname = usePathname()

    async function handleSignOut() {
        await authClient.signOut()
        // Redirect back to the page we came from — if it still requires a
        // session, that page's own auth guard takes over from here.
        router.push(pathname)
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
            Sign out
        </button>
    )
}
