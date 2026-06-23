'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Eye, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@repo/ui/lib/utils'
import { Logo } from '@repo/ui/components/logo'
import { NavbarContext } from '@repo/ui/components/navbar-context'

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
    logoMarkSrc,
    className,
}: {
    navLinks?: NavLink[]
    rightSlot?: React.ReactNode
    previewEnabled?: boolean
    navAlign?: 'center' | 'right'
    logoMarkSrc?: string
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const isGreen = !scrolled

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
                className={cn(
                    'relative px-3.5 py-1.5 text-sm rounded-md transition-colors aria-disabled:opacity-40 aria-disabled:pointer-events-none data-[active=true]:font-medium',
                    isGreen
                        ? 'text-primary-foreground/70 hover:text-primary-foreground data-[active=true]:text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground data-[active=true]:text-foreground',
                )}>
                {item.name}
                {item.comingSoon && (
                    <span
                        className={cn(
                            'ml-1.5 text-[10px] rounded px-1.5 py-px font-medium',
                            isGreen
                                ? 'bg-primary-foreground/15 text-primary-foreground/80'
                                : 'bg-accent/15 text-accent',
                        )}>
                        Soon
                    </span>
                )}
            </Link>
        )
    })

    return (
        <NavbarContext value={{ isGreen }}>
            <header
                className={cn(
                    'sticky inset-x-0 top-0 z-50 overflow-hidden transition-colors duration-300',
                    isGreen
                        ? 'bg-primary'
                        : 'bg-brand-background border-b border-border/60',
                    className,
                )}>
                {/* dot pattern — only when green, matches hero */}
                {isGreen && (
                    <div
                        aria-hidden
                        className='pointer-events-none absolute inset-0 opacity-[0.07]'
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, white 1.4px, transparent 1.4px)',
                            backgroundSize: '22px 22px',
                        }}
                    />
                )}

                {/* vignette — matches datasets/community hero depth */}
                {isGreen && (
                    <div
                        aria-hidden
                        className='absolute inset-0 bg-linear-to-b from-black/15 to-black/10'
                    />
                )}

                <nav
                    className='relative z-10 grid grid-cols-[auto_1fr_auto] items-center h-16 px-6 mx-auto gap-6 max-w-7xl'
                    aria-label='Global'>
                    {/* Logo */}
                    <Link href='/'>
                        {/* Mobile: custom mark SVG (gradient survives on teal bg without inversion) */}
                        {logoMarkSrc && (
                            <img
                                src={logoMarkSrc}
                                alt='Aesops'
                                className='h-8 w-8 lg:hidden'
                            />
                        )}
                        {/* Desktop: full text logo, inverted when green */}
                        <Logo
                            variant='full'
                            className={cn(
                                'h-7 w-auto transition-all duration-300',
                                logoMarkSrc ? 'hidden lg:flex' : 'flex',
                                isGreen && 'brightness-0 invert',
                            )}
                        />
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
                                    <span className='mx-2 text-border select-none'>
                                        |
                                    </span>
                                )}
                            </div>
                        )}
                        {rightSlot}
                        {previewEnabled && (
                            <Link
                                href='/api/preview/disable'
                                title='Disable Preview'>
                                <Eye className='h-4 w-4' />
                                <span className='sr-only'>Disable Preview</span>
                            </Link>
                        )}
                        {navLinks.length > 0 && (
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={cn(
                                    'lg:hidden transition-colors duration-300',
                                    isGreen
                                        ? 'text-primary-foreground'
                                        : 'text-foreground',
                                )}
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
            </header>

            {/* Mobile menu — fixed overlay, does not push content down */}
            {navLinks.length > 0 && isOpen && (
                <div
                    className={cn(
                        'fixed inset-x-0 top-16 z-40 flex flex-col gap-0.5 px-4 py-3 font-sans shadow-lg lg:hidden',
                        isGreen
                            ? 'bg-primary'
                            : 'bg-brand-background border-b border-border/60',
                    )}>
                    {navLinks.map((item) => (
                        <Link
                            key={item._key}
                            href={item.comingSoon ? '#' : item.href}
                            onClick={() => setIsOpen(false)}
                            aria-disabled={item.comingSoon}
                            className={cn(
                                'rounded-md px-3 py-2.5 text-sm transition-colors aria-disabled:opacity-40 aria-disabled:pointer-events-none',
                                isGreen
                                    ? 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/5',
                            )}>
                            {item.name}
                            {item.comingSoon && (
                                <span
                                    className={cn(
                                        'ml-1.5 rounded px-1.5 py-px text-[10px] font-medium',
                                        isGreen
                                            ? 'bg-primary-foreground/15 text-primary-foreground/80'
                                            : 'bg-accent/15 text-accent',
                                    )}>
                                    Soon
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </NavbarContext>
    )
}
