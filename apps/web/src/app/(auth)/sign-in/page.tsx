import { redirect } from 'next/navigation'
import { getVerifiedSession } from '@/lib/platform/session'
import { AuthBrandPanel } from '@/components/platform/auth/auth-brand-panel'
import Logo from '@components/common/Logo'
import { EmailOtpForm } from '@/components/platform/auth/email-otp-form'

export const metadata = { title: 'Sign in | Aesops' }

export default async function SignInPage() {
    const session = await getVerifiedSession()
    if (session) redirect('/datasets')

    return (
        <main className='flex min-h-screen'>
            {/* left — form */}
            <div className='flex flex-1 flex-col items-center justify-center px-6 py-12 lg:flex-none lg:w-[480px] xl:w-[520px]'>
                <div className='w-full max-w-sm'>
                    <Logo className='mb-8 flex-none' />
                    <div className='mb-8'>
                        <h1 className='font-sans font-light text-3xl text-foreground'>
                            Welcome
                        </h1>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            Sign in or create an account with a code sent to your email
                        </p>
                    </div>
                    <EmailOtpForm />
                </div>
            </div>

            {/* right — brand panel */}
            <AuthBrandPanel />
        </main>
    )
}
