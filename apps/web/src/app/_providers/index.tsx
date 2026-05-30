'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from '@/trpc/react'
import DemoAuthProvider from './DemoAuthProvider'

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

function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
        }),
    )

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <DemoAuthProvider>{children}</DemoAuthProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default Providers
