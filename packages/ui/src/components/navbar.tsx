'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Eye, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@repo/ui/lib/utils'
import { Logo } from '@repo/ui/components/logo'

export type NavLink = {
    _key: string
    name: string
    href: string
    comingSoon?: boolean
}

export function Navbar({
    navLinks = [],
    rightSlot,
    previewEnabled,
    navAlign = 'center',
    className,
}: {
    navLinks?: NavLink[]
    rightSlot?: React.ReactNode
    previewEnabled?: boolean
    navAlign?: 'center' | 'right'
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navItems = navLinks.map((item) => {
        let isActive = false
        if (item.href === '/') {
            isActive = pathname === item.href
        } else {
            isActive = pathname?.startsWith(item.href) ?? false
        }
        return (
            <Link
                key={item._key}
                href={item.comingSoon ? '#' : item.href}
                aria-disabled={item.comingSoon}
                data-active={isActive}
                className='relative px-3.5 py-1.5 text-sm text-muted-foreground rounded-md transition-colors hover:text-foreground aria-disabled:opacity-40 aria-disabled:pointer-events-none data-[active=true]:text-foreground data-[active=true]:font-medium'>
                {item.name}
                {item.comingSoon && (
                    <span className='ml-1.5 text-[10px] bg-accent/15 text-accent rounded px-1.5 py-px font-medium'>
                        Soon
                    </span>
                )}
            </Link>
        )
    })

    return (
        <header
            className={cn(
                'sticky inset-x-0 top-0 z-50 bg-brand-background border-b border-border/60',
                className,
            )}>
            <nav
                className='grid grid-cols-[auto_1fr_auto] items-center h-14 px-5 mx-auto gap-6 max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl)'
                aria-label='Global'>

                {/* Logo */}
                <Link href='/'>
                    <Logo className='h-7 w-auto' />
                </Link>

                {/* Center nav — only shown when navAlign="center" */}
                {navAlign === 'center' && navLinks.length > 0 ? (
                    <div className='hidden lg:flex lg:items-center lg:justify-center lg:gap-x-0.5 font-sans'>
                        {navItems}
                    </div>
                ) : (
                    <div />
                )}

                {/* Right slot — for navAlign="right", nav links sit here with a divider */}
                <div className='flex items-center gap-2.5'>
                    {navAlign === 'right' && navLinks.length > 0 && (
                        <div className='hidden lg:flex lg:items-center lg:gap-x-0.5 font-sans'>
                            {navItems}
                            {rightSlot && (
                                <span className='mx-2 text-border select-none'>|</span>
                            )}
                        </div>
                    )}
                    {rightSlot}
                    {previewEnabled && (
                        <Link href='/api/preview/disable' title='Disable Preview'>
                            <Eye className='h-4 w-4' />
                            <span className='sr-only'>Disable Preview</span>
                        </Link>
                    )}
                    {navLinks.length > 0 && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='lg:hidden'
                            aria-label='Toggle menu'>
                            {isOpen ? (
                                <X className='h-5 w-5' />
                            ) : (
                                <Menu className='h-5 w-5' />
                            )}
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile menu */}
            {navLinks.length > 0 && isOpen && (
                <div className='flex flex-col gap-0.5 bg-brand-background border-t border-border/60 py-3 px-4 font-sans lg:hidden'>
                    {navLinks.map((item) => (
                        <Link
                            key={item._key}
                            href={item.comingSoon ? '#' : item.href}
                            onClick={() => setIsOpen(false)}
                            aria-disabled={item.comingSoon}
                            className='px-3 py-2 text-sm text-muted-foreground rounded-md transition-colors hover:text-foreground hover:bg-accent/5 aria-disabled:opacity-40 aria-disabled:pointer-events-none'>
                            {item.name}
                            {item.comingSoon && (
                                <span className='ml-1.5 text-[10px] bg-accent/15 text-accent rounded px-1.5 py-px font-medium'>
                                    Soon
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}
