'use client'

import React from 'react'
// import { ThemeProvider } from 'next-themes'


type ProvidersProps = {
    children: React.ReactNode
}

function Providers({ children }: ProvidersProps) {
    return <div>{children}</div>
}

export default Providers
