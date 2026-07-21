'use client'
import { useState, useTransition } from 'react'
import { Download } from 'lucide-react'
import QRCode from 'qrcode'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@repo/ui/components/input-otp'
import { authClient } from '@/lib/auth-client'

type Stage = 'choice' | 'enroll' | 'backup-codes'

type Props = {
    onDone: () => void
    onSkip?: () => void
    skipLabel?: string
}

export function TwoFactorEnrollment({
    onDone,
    onSkip,
    skipLabel = 'Skip for now',
}: Props) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [stage, setStage] = useState<Stage>('choice')
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
    const [backupCodes, setBackupCodes] = useState<string[]>([])
    const [code, setCode] = useState('')

    function startTotpEnrollment() {
        setError(null)
        startTransition(async () => {
            const { data, error } = await authClient.twoFactor.enable({})
            if (error || !data) {
                setError(error?.message ?? 'Could not start setup')
                return
            }
            const qr = await QRCode.toDataURL(data.totpURI)
            setQrDataUrl(qr)
            setBackupCodes(data.backupCodes)
            setStage('enroll')
        })
    }

    function downloadBackupCodes() {
        const blob = new Blob(
            [
                `Aesops backup codes\nEach code signs you in once if you lose access to your authenticator app.\n\n${backupCodes.join('\n')}\n`,
            ],
            { type: 'text/plain' },
        )
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'aesops-backup-codes.txt'
        link.click()
        URL.revokeObjectURL(url)
    }

    function confirmTotp(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        startTransition(async () => {
            const { error } = await authClient.twoFactor.verifyTotp({ code })
            if (error) {
                setError(
                    error.message ??
                        'Invalid code, check your app and try again',
                )
                return
            }
            setStage('backup-codes')
        })
    }

    if (stage === 'backup-codes') {
        return (
            <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                    Save these somewhere safe each works once.
                </p>

                <div className='rounded-lg border border-border bg-secondary/50 p-4'>
                    <div className='flex items-center justify-between gap-2'>
                        <p className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                            Backup codes
                        </p>
                        <button
                            type='button'
                            onClick={downloadBackupCodes}
                            aria-label='Download backup codes'
                            title='Download backup codes'
                            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary'>
                            <Download size={14} />
                        </button>
                    </div>
                    <div className='mt-3 grid grid-cols-2 gap-2 font-mono text-sm'>
                        {backupCodes.map((c) => (
                            <span key={c}>{c}</span>
                        ))}
                    </div>
                </div>
                <button
                    type='button'
                    onClick={onDone}
                    className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                    Done
                </button>
            </div>
        )
    }

    if (stage === 'enroll') {
        return (
            <form onSubmit={confirmTotp} className='space-y-4'>
                {qrDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- local data URL, no next/image benefit
                    <img
                        src={qrDataUrl}
                        alt='Scan with your authenticator app'
                        className='mx-auto h-40 w-40 rounded-lg border border-border'
                    />
                )}
                <p className='text-center text-sm text-muted-foreground'>
                    Scan this with your authenticator app, then enter the
                    6-digit code it shows.
                </p>

                <InputOTP
                    maxLength={6}
                    placeholder='000000'
                    value={code}
                    onChange={setCode}
                    containerClassName='w-full'>
                    <InputOTPGroup className='w-full'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className='h-11 flex-1 bg-card'
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>

                {error && <p className='text-sm text-destructive'>{error}</p>}

                <button
                    type='submit'
                    disabled={isPending || code.length < 6}
                    className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'>
                    {isPending ? 'Confirming…' : 'Confirm'}
                </button>
            </form>
        )
    }

    return (
        <div className='space-y-3'>
            <button
                type='button'
                onClick={startTotpEnrollment}
                disabled={isPending}
                className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'>
                {isPending ? 'Starting…' : 'Set up an authenticator app'}
            </button>

            {error && <p className='text-sm text-destructive'>{error}</p>}

            {onSkip && (
                <button
                    type='button'
                    onClick={onSkip}
                    className='h-11 w-full rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
                    {skipLabel}
                </button>
            )}
        </div>
    )
}
