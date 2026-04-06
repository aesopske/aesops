'use client'

import React from 'react'
import DemoAuthProvider from './DemoAuthProvider'

type ProvidersProps = {
    children: React.ReactNode
}

function Providers({ children }: ProvidersProps) {
    return <DemoAuthProvider>{children}</DemoAuthProvider>
}

export default Providers
