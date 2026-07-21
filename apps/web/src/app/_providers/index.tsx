'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from '@/trpc/react'
import CookieConsentBanner from '@components/shared/cookie-consent/CookieConsentBanner'
import CookiePreferencesDialog from '@components/shared/cookie-consent/CookiePreferencesDialog'
import CookiePreferencesDialogProvider from '@components/shared/cookie-consent/CookiePreferencesDialogProvider'
import { CookieConsentInitProvider, CookieConsent } from '@/lib/shared/cookie-consent'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
    if (typeof window === 'undefined') return makeQueryClient()
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
}

type ProvidersProps = {
    children: React.ReactNode
    initialCookieConsent: CookieConsent | null
}

function Providers({ children, initialCookieConsent }: ProvidersProps) {
    const queryClient = getQueryClient()
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
        }),
    )

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <CookieConsentInitProvider initialConsent={initialCookieConsent}>
                    <CookiePreferencesDialogProvider>
                        {children}
                        <CookieConsentBanner />
                        <CookiePreferencesDialog />
                    </CookiePreferencesDialogProvider>
                </CookieConsentInitProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers
