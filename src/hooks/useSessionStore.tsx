'use client'

import { useCallback } from 'react'

function useSessionStore(key: string) {
    const updatedKey = `_code_${key}`
    const getValue = useCallback(() => {
        if (typeof window === 'undefined') return
        const value = sessionStorage?.getItem(updatedKey)
        return value ? JSON.parse(value) : null
    }, [updatedKey])

    const saveValue = useCallback(
        (value: unknown) => {
            // find key in session storage
            if (typeof window === 'undefined') return
            const sessionStore = getValue()
            if (sessionStore) {
                // remove the key
                sessionStorage.removeItem(updatedKey)
            }
            // create the key
            sessionStorage.setItem(updatedKey, JSON.stringify(value))
        },
        [getValue, updatedKey],
    )

    return { getValue, saveValue }
}

export default useSessionStore
