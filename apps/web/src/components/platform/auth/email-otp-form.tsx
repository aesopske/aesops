'use client'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@repo/ui/components/input-otp'
import { authClient } from '@/lib/auth-client'
import { GitHubSignInButton } from '@/components/platform/auth/github-sign-in-button'
import { GoogleSignInButton } from '@/components/platform/auth/google-sign-in-button'
import { sanitizeReturnTo } from '@/lib/platform/return-to'

type Step = 'email' | 'code' | 'two-factor'
type TwoFactorMethod = 'totp' | 'backup' | 'otp'

export function EmailOtpForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [from] = useQueryState('from')
    const returnTo = sanitizeReturnTo(from, '/datasets')

    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod>('totp')
    const [twoFactorCode, setTwoFactorCode] = useState('')
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000)
        return () => clearTimeout(timer)
    }, [resendCooldown])

    function finishSignIn(isNewUser: boolean) {
        router.push(isNewUser ? '/onboarding' : returnTo)
        router.refresh()
    }

    function sendCode() {
        setError(null)
        startTransition(async () => {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'sign-in',
            })
            if (error) {
                setError(error.message ?? 'Could not send a code, try again')
            } else {
                setStep('code')
                setResendCooldown(30)
            }
        })
    }

    function handleSendCode(e: React.FormEvent) {
        e.preventDefault()
        sendCode()
    }

    function handleVerifyCode(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        startTransition(async () => {
            const { data, error } = await authClient.signIn.emailOtp({
                email,
                otp: code,
                name: email.split('@')[0],
            })
            if (error) {
                setError(error.message ?? 'Invalid or expired code')
                return
            }
            if (data?.user.twoFactorEnabled) {
                setStep('two-factor')
                return
            }
            // No username yet means onboarding (profile + optional 2FA setup)
            // hasn't been completed — true for brand-new accounts and for
            // existing accounts that signed up before onboarding existed.
            finishSignIn(!data?.user.username)
        })
    }

    function handleVerifyTwoFactor(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        startTransition(async () => {
            const { error } =
                twoFactorMethod === 'backup'
                    ? await authClient.twoFactor.verifyBackupCode({ code: twoFactorCode })
                    : twoFactorMethod === 'otp'
                      ? await authClient.twoFactor.verifyOtp({ code: twoFactorCode })
                      : await authClient.twoFactor.verifyTotp({ code: twoFactorCode })
            if (error) {
                setError(error.message ?? 'Invalid code')
                return
            }
            finishSignIn(false)
        })
    }

    function selectTwoFactorMethod(method: TwoFactorMethod) {
        setError(null)
        setTwoFactorCode('')
        setTwoFactorMethod(method)
        if (method === 'otp') {
            startTransition(async () => {
                const { error } = await authClient.twoFactor.sendOtp()
                if (error) setError(error.message ?? 'Could not send a code')
            })
        }
    }

    if (step === 'two-factor') {
        return (
            <div className='space-y-4'>
                <form onSubmit={handleVerifyTwoFactor} className='space-y-4'>
                    <div className='space-y-1'>
                        <label className='block text-sm font-medium text-foreground'>
                            {twoFactorMethod === 'backup' ? 'Backup code' : 'Verification code'}
                        </label>
                        {twoFactorMethod === 'backup' ? (
                            <input
                                type='text'
                                autoComplete='one-time-code'
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                className='block h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                            />
                        ) : (
                            <InputOTP
                                maxLength={6}
                                placeholder='000000'
                                value={twoFactorCode}
                                onChange={setTwoFactorCode}
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
                        )}
                    </div>

                    {error && <p className='text-sm text-destructive'>{error}</p>}

                    <button
                        type='submit'
                        disabled={isPending || !twoFactorCode}
                        className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'>
                        {isPending ? 'Verifying…' : 'Verify'}
                    </button>
                </form>

                <div className='flex justify-center gap-4 text-sm'>
                    {twoFactorMethod !== 'totp' && (
                        <button
                            type='button'
                            onClick={() => selectTwoFactorMethod('totp')}
                            className='text-muted-foreground hover:text-foreground hover:underline'>
                            Use authenticator app
                        </button>
                    )}
                    {twoFactorMethod !== 'backup' && (
                        <button
                            type='button'
                            onClick={() => selectTwoFactorMethod('backup')}
                            className='text-muted-foreground hover:text-foreground hover:underline'>
                            Use a backup code
                        </button>
                    )}
                    {twoFactorMethod !== 'otp' && (
                        <button
                            type='button'
                            onClick={() => selectTwoFactorMethod('otp')}
                            className='text-muted-foreground hover:text-foreground hover:underline'>
                            Email me a code
                        </button>
                    )}
                </div>
            </div>
        )
    }

    if (step === 'code') {
        return (
            <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                    Enter the code we sent to <span className='font-medium text-foreground'>{email}</span>
                </p>

                <form onSubmit={handleVerifyCode} className='space-y-4'>
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
                        {isPending ? 'Verifying…' : 'Continue'}
                    </button>
                </form>

                <div className='flex items-center justify-between text-sm'>
                    <button
                        type='button'
                        onClick={() => {
                            setStep('email')
                            setCode('')
                            setError(null)
                        }}
                        className='text-muted-foreground hover:text-foreground hover:underline'>
                        Use a different email
                    </button>

                    <button
                        type='button'
                        onClick={sendCode}
                        disabled={isPending || resendCooldown > 0}
                        className='text-muted-foreground hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50'>
                        {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            <div className='space-y-2'>
                <GoogleSignInButton callbackURL={returnTo} />
                <GitHubSignInButton callbackURL={returnTo} />
            </div>

            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-xs'>
                    <span className='bg-card px-2 text-muted-foreground'>or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSendCode} className='space-y-4'>
                <div className='space-y-1'>
                    <label htmlFor='email' className='block text-sm font-medium text-foreground'>
                        Email
                    </label>
                    <input
                        id='email'
                        type='email'
                        autoComplete='email'
                        placeholder='you@example.com'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='block h-11 w-full rounded-lg border border-border bg-card px-3.5 text-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20'
                    />
                </div>

                {error && <p className='text-sm text-destructive'>{error}</p>}

                <button
                    type='submit'
                    disabled={isPending}
                    className='h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'>
                    {isPending ? 'Sending code…' : 'Continue with email'}
                </button>
            </form>
        </div>
    )
}
