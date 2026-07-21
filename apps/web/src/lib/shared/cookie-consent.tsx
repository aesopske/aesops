'use client'

import Cookie from 'js-cookie'
import React, { createContext, useContext, useSyncExternalStore } from 'react'
import {
    CONSENT_VERSION,
    COOKIE_EXPIRY_DAYS,
    COOKIE_NAME,
    CookieConsent,
    parseConsentCookie,
} from './cookie-consent-cookie'

export type { CookieConsent }
export { parseConsentCookie, COOKIE_NAME, COOKIE_EXPIRY_DAYS }

const CHANGE_EVENT = 'cookie-consent-changed'

let cachedRaw: string | null | undefined
let cachedConsent: CookieConsent | null = null

function readConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null
    const raw = Cookie.get(COOKIE_NAME) ?? null
    if (raw === cachedRaw) return cachedConsent

    cachedRaw = raw
    cachedConsent = parseConsentCookie(raw)
    return cachedConsent
}

function writeConsent(analytics: boolean) {
    const consent: CookieConsent = {
        version: CONSENT_VERSION,
        analytics,
        necessary: true,
        decidedAt: Date.now(),
    }
    Cookie.set(COOKIE_NAME, JSON.stringify(consent), { expires: COOKIE_EXPIRY_DAYS })
    window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback)
    return () => window.removeEventListener(CHANGE_EVENT, callback)
}

// Server reads the cookie from the request and seeds this context, so the
// first client render (hydration) already matches the real consent state
// instead of flashing the "undecided" UI before settling.
const InitialCookieConsentContext = createContext<CookieConsent | null>(null)

export function CookieConsentInitProvider({
    initialConsent,
    children,
}: {
    initialConsent: CookieConsent | null
    children: React.ReactNode
}) {
    return (
        <InitialCookieConsentContext.Provider value={initialConsent}>
            {children}
        </InitialCookieConsentContext.Provider>
    )
}

export function useCookieConsent() {
    const initialConsent = useContext(InitialCookieConsentContext)
    const consent = useSyncExternalStore(subscribe, readConsent, () => initialConsent)

    return {
        consent,
        hasDecided: consent !== null,
        // Analytics is opt-out: on by default until the user explicitly declines it.
        analyticsEnabled: consent?.analytics ?? true,
        acceptAll: () => writeConsent(true),
        rejectNonEssential: () => writeConsent(false),
        setAnalytics: (value: boolean) => writeConsent(value),
    }
}
