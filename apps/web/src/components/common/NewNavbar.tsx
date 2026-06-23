'use client'

import { usePathname } from 'next/navigation'
import { Navbar, type NavLink } from '@repo/ui/components/navbar'

export type { NavLink }

function WebNavbar({
    previewEnabled,
    navLinks,
    rightSlot,
    navAlign,
    logoMarkSrc,
}: {
    previewEnabled: boolean
    navLinks?: NavLink[]
    rightSlot?: React.ReactNode
    navAlign?: 'center' | 'right'
    logoMarkSrc?: string
}) {
    const pathname = usePathname()

    if (pathname?.includes('/studio')) return null

    return (
        <Navbar
            navLinks={navLinks}
            rightSlot={rightSlot}
            navAlign={navAlign}
            previewEnabled={previewEnabled}
            logoMarkSrc={logoMarkSrc}
            className={pathname?.includes('/blog/') ? 'relative' : undefined}
        />
    )
}

export default WebNavbar
