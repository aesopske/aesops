'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog'
import { authClient } from '@/lib/auth-client'
import { TwoFactorEnrollment } from '@/components/platform/auth/two-factor-enrollment'

export function TwoFactorSettings({ enabled }: { enabled: boolean }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    function handleEnrolled() {
        setOpen(false)
        router.refresh()
    }

    function handleDisable() {
        setError(null)
        startTransition(async () => {
            const { error } = await authClient.twoFactor.disable({})
            if (error) {
                setError(error.message ?? 'Could not disable two-factor authentication')
            } else {
                router.refresh()
            }
        })
    }

    return (
        <div className='flex items-center justify-between px-6 py-4'>
            <div>
                <p className='text-sm font-medium text-foreground'>Authenticator app</p>
                <p className='text-sm text-muted-foreground'>
                    {enabled
                        ? 'Enabled — you’ll be asked for a code on sign-in.'
                        : 'Require a code from an authenticator app when signing in.'}
                </p>
                {error && <p className='mt-1 text-xs text-destructive'>{error}</p>}
            </div>

            {enabled ? (
                <button
                    onClick={handleDisable}
                    disabled={isPending}
                    className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50'>
                    {isPending ? 'Disabling…' : 'Disable'}
                </button>
            ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <button
                        onClick={() => setOpen(true)}
                        className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
                        Enable
                    </button>
                    <DialogContent className='sm:max-w-sm'>
                        <DialogHeader>
                            <DialogTitle>Set up an authenticator app</DialogTitle>
                        </DialogHeader>
                        <TwoFactorEnrollment onDone={handleEnrolled} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
