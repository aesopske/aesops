'use client'

import { usePathname } from 'next/navigation'

import Logo from './Logo'
import Hamburger from 'hamburger-react'
import useDisclosure from '@src/hooks/useDisclosure'

const navigation = [
    {
        name: 'Home',
        coming: false,
        href: '/',
    },
    { name: 'Services', href: '/#services', coming: false },
    { name: 'Datasets', href: '/#', coming: true },
    // { name: 'Trends', href: '/#', coming: true },
    // { name: 'Tools', href: '/tools' },
    { name: 'Competitions', href: '/', coming: true },
    { name: 'Blog', href: '/blog', coming: false },
]

function Navbar() {
    const { isOpen, onToggle } = useDisclosure(false)
    const pathname = usePathname()

    if (pathname?.includes('/studio')) return null
    return (
        <header className='sticky inset-x-0 top-0 z-50 text-aes-dark border-b bg-brand-background max-h-20 h-fit'>
            <nav
                className='flex items-center justify-between px-6 py-4 lg:px-0 container-fluid max-w-screen-xl mx-auto h-full'
                aria-label='Global'>
                <Logo />
                <div className='flex lg:hidden'>
                    <Hamburger
                        toggled={isOpen}
                        onToggle={onToggle}
                        color='#000'
                    />
                </div>
                <div className='hidden lg:flex lg:gap-x-6 font-sans'>
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            aria-disabled={item.coming}
                            className='relative text-sm font-semibold leading-6 aria-disabled:opacity-50 aria-disabled:pointer-events-none'>
                            {item.name}
                            {item.coming ? (
                                <sup className='w-full bg-aes-secondary text-aes-dark rounded px-2 py-[1px]'>
                                    Coming soon
                                </sup>
                            ) : null}
                        </a>
                    ))}
                </div>
            </nav>

            {isOpen ? (
                <div className='flex flex-col gap-4 bg-brand-background shadow-md p-8 font-sans lg:hidden'>
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            aria-disabled={item.coming}
                            className='relative text-base font-semibold leading-6 aria-disabled:opacity-50 aria-disabled:pointer-events-none'>
                            {item.name}
                            {item.coming ? (
                                <sup className='w-full bg-aes-secondary text-aes-dark rounded px-2 py-[1px]'>
                                    Coming soon
                                </sup>
                            ) : null}
                        </a>
                    ))}
                </div>
            ) : null}
        </header>
    )
}
export default Navbar
