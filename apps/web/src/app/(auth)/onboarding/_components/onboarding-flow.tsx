'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthBrandPanel } from '@/components/platform/auth/auth-brand-panel'
import Logo from '@components/common/Logo'
import { TwoFactorEnrollment } from '@/components/platform/auth/two-factor-enrollment'
import { ProfileStep } from './profile-step'

type Step = 'profile' | 'two-factor'

const copy: Record<Step, { badge: string; title: string; description: string }> = {
    profile: {
        badge: 'Step 1 of 2',
        title: 'Tell us who you are',
        description: 'Your name and username show up on the datasets and discussions you contribute.',
    },
    'two-factor': {
        badge: 'Step 2 of 2',
        title: 'Add an extra layer of security',
        description:
            'Optional, and you can turn it on any time from account settings. An authenticator app is the strongest option — a code by email works too.',
    },
}

export function OnboardingFlow({ name }: { name: string }) {
    const router = useRouter()
    const [step, setStep] = useState<Step>('profile')

    function finish() {
        router.push('/datasets')
        router.refresh()
    }

    return (
        <main className='flex min-h-screen'>
            {/* left — form */}
            <div className='flex flex-1 flex-col items-center justify-center px-6 py-12 lg:flex-none lg:w-[480px] xl:w-[520px]'>
                <div className='w-full max-w-sm'>
                    <Logo className='mb-8 flex-none' />
                    <div className='mb-8'>
                        <h1 className='font-sans font-light text-3xl text-foreground'>{copy[step].title}</h1>
                        <p className='mt-2 text-sm text-muted-foreground'>{copy[step].description}</p>
                    </div>

                    {step === 'profile' ? (
                        <ProfileStep defaultName={name} onDone={() => setStep('two-factor')} />
                    ) : (
                        <TwoFactorEnrollment onDone={finish} onSkip={finish} />
                    )}
                </div>
            </div>

            {/* right — brand panel */}
            <AuthBrandPanel
                badge={copy[step].badge}
                title={copy[step].title}
                description={copy[step].description}
                features={[]}
            />
        </main>
    )
}
