'use client'

import { authClient } from '@repo/auth/client'
// import { LoginForm } from '@repo/ui'
// import {} from '@repo/ui'
import { Github } from 'lucide-react'
import { useState } from 'react'

/**
 * Login Page for the Auth Gateway.
 *
 * Uses the reusable LoginForm from @aesops/ui and the isolated Better Auth client.
 */
export function LoginPage(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState(false)

    const handleGithubLogin = async () => {
        setIsLoading(true)
        try {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: '/', // Better Auth handles redirects based on trustedOrigins
            })
        } catch (error) {
            console.error('Login failed', error)
        } finally {
            setIsLoading(false)
        }
    }

    const providers = [
        {
            id: 'github',
            name: 'GitHub',
            icon: <Github className='h-4 w-4' />,
            onClick: handleGithubLogin,
        },
    ]

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8'>
            {/*<LoginForm
                title='Sign in to Aesops'
                description='Central Authentication Gateway'
                providers={providers}
                isLoading={isLoading}
                showEmailLogin={false} // Currently only supporting GitHub OAuth
                className='w-full max-w-md'
                termsUrl='/terms'
                privacyUrl='/privacy'
            />*/}
        </div>
    )
}
