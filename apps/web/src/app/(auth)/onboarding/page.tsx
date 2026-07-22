import { redirect } from 'next/navigation'
import { getVerifiedSession } from '@/lib/platform/session'
import { OnboardingFlow } from './_components/onboarding-flow'

export const metadata = { title: 'Set up your account | Aesops' }

export default async function OnboardingPage() {
    const session = await getVerifiedSession()
    if (!session) redirect('/sign-in')

    return <OnboardingFlow name={session.user.name} />
}
