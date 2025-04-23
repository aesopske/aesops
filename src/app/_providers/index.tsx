'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'
import { usePathname } from 'next/navigation'
import { env } from '@src/env'
import TRPCProvider from '../_trpc/Provider'
import DemoAuthProvider from './DemoAuthProvider'

// import { ThemeProvider } from 'next-themes'

type ProvidersProps = {
    children: React.ReactNode
}

// setup posthog only in production ie the env variables are only available in production
if (typeof window !== 'undefined' && env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.set_config({
        autocapture: false,
        capture_pageleave: false,
    })
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        autocapture: {
            dom_event_allowlist: ['click'],
            url_ignorelist: ['localhost', 'aesops.co.ke./studio/'],
            element_allowlist: ['button', 'a', 'select'],
        },
    })
}

function Providers({ children }: ProvidersProps) {
    const pathname = usePathname()

    return (
        <TRPCProvider>
            <ReactQueryDevtools />
            <DemoAuthProvider>
                <PostHogProvider client={posthog}>
                    <ClerkProvider afterSignOutUrl={pathname}>
                        {children}
                    </ClerkProvider>
                </PostHogProvider>
            </DemoAuthProvider>
        </TRPCProvider>
    )
}

export default Providers
