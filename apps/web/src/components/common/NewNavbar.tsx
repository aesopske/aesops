'use client'

import { usePathname } from 'next/navigation'
import { Navbar, type NavLink } from '@repo/ui/components/navbar'

export type { NavLink }

function WebNavbar({
    previewEnabled,
    navLinks,
    rightSlot,
    navAlign,
}: {
    previewEnabled: boolean
    navLinks?: NavLink[]
    rightSlot?: React.ReactNode
    navAlign?: 'center' | 'right'
}) {
    const pathname = usePathname()

    if (pathname?.includes('/studio')) return null

    return (
        <Navbar
            navLinks={navLinks}
            rightSlot={rightSlot}
            navAlign={navAlign}
            previewEnabled={previewEnabled}
            className={pathname?.includes('/blog/') ? 'relative' : undefined}
        />
    )
}

export default WebNavbar
