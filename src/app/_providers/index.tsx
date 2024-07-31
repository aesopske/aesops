'use client'

import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { usePathname } from 'next/navigation'
import DemoAuthProvider from './DemoAuthProvider'

// import { ThemeProvider } from 'next-themes'

type ProvidersProps = {
    children: React.ReactNode
}

function Providers({ children }: ProvidersProps) {
    const pathname = usePathname()
    return (
        <DemoAuthProvider>
            <ClerkProvider afterSignOutUrl={pathname}>{children}</ClerkProvider>
        </DemoAuthProvider>
    )
}

export default Providers
