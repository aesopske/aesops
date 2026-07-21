'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

type CookiePreferencesDialogContextType = {
    isOpen: boolean
    open: () => void
    close: () => void
}

const CookiePreferencesDialogContext =
    createContext<CookiePreferencesDialogContextType | null>(null)

function CookiePreferencesDialogProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    const value = useMemo(
        () => ({
            isOpen,
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
        }),
        [isOpen],
    )

    return (
        <CookiePreferencesDialogContext.Provider value={value}>
            {children}
        </CookiePreferencesDialogContext.Provider>
    )
}

export function useCookiePreferencesDialog() {
    const context = useContext(CookiePreferencesDialogContext)
    if (!context) {
        throw new Error(
            'useCookiePreferencesDialog must be used within a CookiePreferencesDialogProvider',
        )
    }
    return context
}

export default CookiePreferencesDialogProvider
