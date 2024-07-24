'use client'

import Cookie from 'js-cookie'
import { createContext } from 'react'
import { env } from '@src/env'

type AuthContextType = {
    isAuthenticated: boolean
}

export const DemoAuthContext = createContext<AuthContextType | null>(null)

function DemoAuthProvider({ children }) {
    // check if current URL is demo URL
    const authedHosts = ['demo.aesops.co.ke', 'localhost']
    const shouldBeAuthed =
        typeof window !== 'undefined' &&
        authedHosts.includes(window.location.hostname)
            ? true
            : false

    const isAuthenticated = Cookie.get('__demo_auth') ? true : false

    const credentials = env.NEXT_PUBLIC_DEMO_CREDENTIALS
        ? env.NEXT_PUBLIC_DEMO_CREDENTIALS.split(':')
        : []

    if (shouldBeAuthed && !isAuthenticated) {
        if (!credentials.length) {
            throw new Error(
                'Missing DEMO_CREDENTIALS in your environment variables',
            )
        }
        const [username, password] = credentials

        const promptuser = prompt('Enter username')
        const promptpass = prompt('Enter password')

        if (promptuser !== username || promptpass !== password) {
            alert('Invalid credentials')
            return
        }

        const hashed = btoa(`${username}:${password}`)
        Cookie.set('__demo_auth', hashed, { expires: 7 })
    }

    return (
        <DemoAuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </DemoAuthContext.Provider>
    )
}

export default DemoAuthProvider
