'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Database, UserRound } from 'lucide-react'

const links = [
    { href: '/profile', label: 'Datasets', icon: Database },
    { href: '/profile/downloads', label: 'Analytics', icon: BarChart3 },
    { href: '/profile/account', label: 'Account', icon: UserRound },
]

export function ProfileSidebar() {
    const pathname = usePathname()

    return (
        <nav className='flex flex-col gap-0.5'>
            {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                                ? 'bg-secondary font-medium text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        <Icon size={15} />
                        {label}
                    </Link>
                )
            })}
        </nav>
    )
}
