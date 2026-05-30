import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@repo/auth'
import { AuthBrandPanel } from '@/components/platform/auth/auth-brand-panel'
import Logo from '@components/common/Logo'
import { SignInForm } from './_components/sign-in-form'

export const metadata = { title: 'Sign in | Aesops' }

export default async function SignInPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (session) redirect('/datasets')

    return (
        <main className='flex min-h-screen'>
            {/* left — form */}
            <div className='flex flex-1 flex-col items-center justify-center px-6 py-12 lg:flex-none lg:w-[480px] xl:w-[520px]'>
                <div className='w-full max-w-sm'>
                    <Logo className='mb-8 flex-none' />
                    <div className='mb-8'>
                        <h1 className='font-sans font-light text-3xl text-foreground'>
                            Welcome back
                        </h1>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            Sign in to manage your datasets
                        </p>
                    </div>
                    <SignInForm />
                </div>
            </div>

            {/* right — brand panel */}
            <AuthBrandPanel />
        </main>
    )
}
