'use client'

import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { useCookieConsent } from '@/lib/shared/cookie-consent'
import { useCookiePreferencesDialog } from './CookiePreferencesDialogProvider'

function CookieConsentBanner() {
    const { hasDecided, acceptAll, rejectNonEssential } = useCookieConsent()
    const { open } = useCookiePreferencesDialog()

    if (hasDecided) return null

    return (
        <div className='fixed bottom-6 left-6 right-6 z-50 sm:right-auto sm:w-full sm:max-w-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out'>
            <div className='flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xl'>
                <div className='flex items-start gap-3'>
                    <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Cookie size={18} />
                    </span>
                    <p className='text-sm leading-relaxed text-card-foreground/80 font-sans pt-1.5'>
                        We use{' '}
                        <Link
                            href='/cookie-policy'
                            className='underline underline-offset-4 decoration-card-foreground/30 hover:decoration-card-foreground'>
                            cookies
                        </Link>{' '}
                        for essential site functionality and, with your consent, for
                        analytics.
                    </p>
                </div>

                <div className='flex items-center gap-2'>
                    <Button
                        variant='default'
                        size='sm'
                        className='flex-1'
                        onClick={acceptAll}>
                        Allow
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        className='flex-1'
                        onClick={rejectNonEssential}>
                        Decline
                    </Button>
                </div>

                <button
                    type='button'
                    onClick={open}
                    className='text-xs text-card-foreground/50 underline underline-offset-4 hover:text-card-foreground/80 transition-colors self-center'>
                    Manage preferences
                </button>
            </div>
        </div>
    )
}

export default CookieConsentBanner
