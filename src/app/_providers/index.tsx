'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'

type ProvidersProps = {
    children: React.ReactNode
}

function Providers({ children }: ProvidersProps) {
    return <ThemeProvider>{children}</ThemeProvider>
}

export default Providers
