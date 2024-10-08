'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import { usePathname } from 'next/navigation'
import DemoAuthProvider from './DemoAuthProvider'

// import { ThemeProvider } from 'next-themes'

type ProvidersProps = {
    children: React.ReactNode
}

function Providers({ children }: ProvidersProps) {
    const pathname = usePathname()
    const [queryClient] = React.useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <DemoAuthProvider>
                <ClerkProvider afterSignOutUrl={pathname}>
                    {children}
                </ClerkProvider>
            </DemoAuthProvider>
        </QueryClientProvider>
    )
}

export default Providers
