'use client'

import Link from 'next/link'
import { Cookie } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@repo/ui/components/dialog'
import { Button } from '@repo/ui/components/button'
import { Switch } from '@repo/ui/components/switch'
import { useCookieConsent } from '@/lib/shared/cookie-consent'
import { useCookiePreferencesDialog } from './CookiePreferencesDialogProvider'

function CookiePreferencesDialog() {
    const { isOpen, close } = useCookiePreferencesDialog()
    const { analyticsEnabled, setAnalytics, acceptAll, rejectNonEssential } = useCookieConsent()

    function handleOpenChange(open: boolean) {
        if (!open) close()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Cookie size={18} />
                    </span>
                    <DialogTitle>Cookie Preferences</DialogTitle>
                    <DialogDescription>
                        Choose which cookies you allow. See our{' '}
                        <Link href='/cookie-policy'>Cookie Policy</Link> for details.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-3'>
                    <div className='flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-sm font-medium text-foreground'>
                                Necessary
                            </span>
                            <span className='text-xs text-muted-foreground'>
                                Required for the site to function: authentication and
                                error/performance monitoring. Always on.
                            </span>
                        </div>
                        <Switch checked disabled aria-label='Necessary cookies' />
                    </div>

                    <div className='flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4'>
                        <div className='flex flex-col gap-1'>
                            <span className='text-sm font-medium text-foreground'>
                                Analytics
                            </span>
                            <span className='text-xs text-muted-foreground'>
                                Vercel Analytics and Speed Insights help us understand
                                site usage and performance.
                            </span>
                        </div>
                        <Switch
                            checked={analyticsEnabled}
                            onCheckedChange={setAnalytics}
                            aria-label='Analytics cookies'
                        />
                    </div>
                </div>

                <DialogFooter className='flex-col gap-2 sm:flex-col'>
                    <div className='flex w-full items-center gap-2'>
                        <Button
                            variant='default'
                            className='flex-1'
                            onClick={() => {
                                acceptAll()
                                close()
                            }}>
                            Allow all
                        </Button>
                        <Button
                            variant='outline'
                            className='flex-1'
                            onClick={() => {
                                rejectNonEssential()
                                close()
                            }}>
                            Decline all
                        </Button>
                    </div>
                    <Button variant='ghost' className='w-full' onClick={close}>
                        Save preferences
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CookiePreferencesDialog
