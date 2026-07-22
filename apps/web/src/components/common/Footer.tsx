'use client'

import { Cookie } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCookiePreferencesDialog } from '@components/shared/cookie-consent/CookiePreferencesDialogProvider'
import { SOCIALS } from '@/lib/constants/socials'
import Logo from './Logo'

const platform = [
    { label: 'Datasets', href: 'http://localhost:3001' },
    { label: 'Consultation', href: '/consultation' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Community', href: '/community' },
    { label: 'Blog', href: '/blog' },
]

const resources = [
    { label: 'Write for Aesops', href: '/blog/contribute' },
    { label: 'Sitemap', href: '/sitemap.xml' },
    { label: 'Home', href: '/' },
]

const company = [
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
]


function Footer() {
    const pathname = usePathname()
    const { open: openCookiePreferences } = useCookiePreferencesDialog()
    if (pathname?.includes('/studio')) return null

    const year = new Date().getFullYear()

    return (
        <footer className='relative overflow-hidden w-full bg-primary px-6 pt-16 pb-8'>
            <div
                className='absolute inset-0 opacity-[0.06] pointer-events-none'
                style={{
                    backgroundImage:
                        'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            <div className='relative z-10 mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl)'>
                <div className='grid grid-cols-1 gap-12 lg:grid-cols-[1.8fr_2.2fr] lg:gap-16'>
                    <div className='flex flex-col gap-6'>
                        {/* Mobile: gradient mark */}
                        <img src='/logo-mark.svg' alt='Aesops' className='h-9 w-9 md:hidden' />
                        {/* Desktop: full text logo inverted white */}
                        <Logo className='brightness-0 invert hidden md:flex' />
                        <p className='text-primary-foreground/70 text-sm leading-relaxed max-w-xs font-sans'>
                            Aesops is a pioneering data organisation in Kenya,
                            collecting, curating, and disseminating data to
                            drive data-driven decision-making and innovation.
                        </p>
                        <div className='flex items-center gap-4'>
                            {SOCIALS.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    aria-label={label}
                                    className='text-primary-foreground/60 hover:text-primary-foreground transition-colors'>
                                    <Icon className='w-5 h-5' />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
                        <div className='flex flex-col gap-4'>
                            <span className='font-sans font-semibold text-primary-foreground text-sm'>
                                Platform
                            </span>
                            <div className='flex flex-col gap-3'>
                                {platform.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className='text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans transition-colors w-fit'>
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <span className='font-sans font-semibold text-primary-foreground text-sm'>
                                Resources
                            </span>
                            <div className='flex flex-col gap-3'>
                                {resources.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className='text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans transition-colors w-fit'>
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <span className='font-sans font-semibold text-primary-foreground text-sm'>
                                Company
                            </span>
                            <div className='flex flex-col gap-3'>
                                {company.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className='text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans transition-colors w-fit'>
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='my-10 border-primary-foreground/20' />

                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-primary-foreground/60 text-sm font-sans'>
                        © {year} Aesops. All rights reserved.
                    </p>
                    <button
                        type='button'
                        onClick={openCookiePreferences}
                        aria-label='Manage Cookie Preferences'
                        title='Manage Cookie Preferences'
                        className='inline-flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground text-sm font-sans transition-colors'>
                        <Cookie className='w-5 h-5' />
                        Cookies
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default Footer
