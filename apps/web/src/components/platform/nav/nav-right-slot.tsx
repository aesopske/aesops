'use client'

import { authClient } from '@/lib/auth-client'
import { UserDropdown } from './user-dropdown'
import { AuthNavLinks } from './auth-nav-links'

export function NavRightSlot() {
    const { data: session } = authClient.useSession()
    const user = session?.user

    if (!user) return <AuthNavLinks />

    const initials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <UserDropdown
            name={user.name}
            email={user.email}
            image={user.image}
            initials={initials}
        />
    )
}
