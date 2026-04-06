'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchStreamLink, httpBatchLink } from '@trpc/react-query'
import SuperJSON from 'superjson'
import React, { useState } from 'react'
import { api } from './client'

const isProduction = process.env.NODE_ENV === 'production'

function getBaseUrl() {
    if (isProduction) {
        if (typeof window !== 'undefined') {
            return window?.location.origin
        }
        // if (VERCEL_URL) return `https://${VERCEL_URL}`
        return process.env.SITE_URL ?? 'https://aesops.co.ke'
    }
    return `http://localhost:${process.env.PORT ?? 3000}`
}

function TRPCProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => {
        return new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                },
            },
        })
    })

    const [trpcClient] = useState(() => {
        return api.createClient({
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    transformer: SuperJSON,
                }),
                httpBatchStreamLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    transformer: SuperJSON,
                }),
            ],
        })
    })

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}

export default TRPCProvider
