'use client'

import { UserButton } from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import Hamburger from 'hamburger-react'
import { Eye } from 'lucide-react'
import { usePathname } from 'next/navigation'
import useDisclosure from '@src/hooks/useDisclosure'
import { cn } from '@src/lib/utils'
import Logo from './Logo'
import AesopLink from './atoms/AesopLink'
import ClerkWrapper from './organisms/clerk-wrapper/ClerkWrapper'

const navigation = [
    // { name: 'Datasets', href: '/datasets', coming: true },
    // { name: 'Competitions', href: '/competitions', coming: true },
    { name: 'Home', href: '/', coming: false },
    { name: 'Data Digest', href: '/data-digest', coming: false },
    { name: 'About Us', href: '/about-us', coming: false },
    { name: 'Blog', href: '/blog', coming: false },
    // { name: 'Tools', href: '/tools' },
]

function Navbar({ previewEnabled }: { previewEnabled: boolean }) {
    const { isOpen, onToggle } = useDisclosure(false)
    const pathname = usePathname()
    const pathnameBlog = pathname?.includes('/blog/')
    if (pathname?.includes('/studio')) return null
    return (
        <header
            className={cn(
                'sticky inset-x-0 top-0 z-50 text-brandprimary-900 border-b border-brandaccent-50 bg-brand-background h-fit md:max-h-20 shadow-xs',
                { relative: pathnameBlog },
            )}>
            <nav
                className='flex items-center justify-between px-5 py-2 mx-auto h-full border-b border-brandaccent-50 gap-5 md:border-none lg:py-4 2xl:px-0 max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl)'
                aria-label='Global'>
                <Logo />

                <div className='flex items-center gap-5'>
                    <div className='hidden lg:flex lg:items-center lg:gap-x-6 font-sans'>
                        {navigation.map((item) => {
                            let isActive = false
                            if (item.href === '/') {
                                isActive = pathname === item.href
                            } else {
                                // remove the initial slash from the pathname
                                const pathnameWithoutSlash = pathname.slice(1)
                                isActive = pathnameWithoutSlash?.includes(
                                    item.href.slice(1),
                                )
                            }
                            return (
                                <AesopLink
                                    key={item.name}
                                    href={item.href}
                                    aria-disabled={item.coming}
                                    data-active={isActive}
                                    className='relative text-sm font-normal leading-6 aria-disabled:opacity-50 aria-disabled:pointer-events-none w-fit data-[active=true]:underline underline-offset-8 decoration-dotted'>
                                    {item.name}
                                    {item.coming ? (
                                        <sup className='w-full bg-brandaccent-500 text-brandprimary-900 rounded-sm px-2 py-[1px]'>
                                            Coming soon
                                        </sup>
                                    ) : null}
                                </AesopLink>
                            )
                        })}
                    </div>
                    <ClerkWrapper
                        renderSignedIn={() => (
                            <div className='border border-brandprimary-900 p-2 px-4 rounded-full flex'>
                                <UserButton showName />
                                <div className='flex lg:hidden'>
                                    <Hamburger
                                        toggled={isOpen}
                                        onToggle={onToggle}
                                        color='#000'
                                        size={20}
                                    />
                                </div>
                            </div>
                        )}
                        renderSignedOut={() => (
                            <div className='flex lg:hidden'>
                                <Hamburger
                                    toggled={isOpen}
                                    onToggle={onToggle}
                                    color='#000'
                                    size={20}
                                />
                            </div>
                        )}
                        renderLoading={() => (
                            <span className='animate-pulse min-h-10 rounded-full w-36 bg-brandaccent-100/50' />
                        )}
                    />
                </div>
                {previewEnabled && (
                    <AesopLink
                        type='button'
                        href='/api/preview/disable'
                        title='Disable Preview'>
                        <Eye />
                        <span className='sr-only'>Disable Preview</span>
                    </AesopLink>
                )}
            </nav>

            <AnimatePresence mode='wait' initial={false}>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delayChildren: 0.4 }}
                        className='flex flex-col gap-4 bg-brand-background shadow-md py-4 px-6 font-sans lg:hidden'>
                        {navigation.map((item) => (
                            <AesopLink
                                key={item.name}
                                href={item.href}
                                aria-disabled={item.coming}
                                className='relative text-base font-normal leading-6 aria-disabled:opacity-50 aria-disabled:pointer-events-none'>
                                {item.name}
                                {item.coming ? (
                                    <sup className='w-full bg-brandaccent-500 text-brandprimary-900 rounded-sm px-2 py-[1px]'>
                                        Coming soon
                                    </sup>
                                ) : null}
                            </AesopLink>
                        ))}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </header>
    )
}
export default Navbar
