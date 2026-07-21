export type CookieConsent = {
    version: 1
    analytics: boolean
    necessary: true
    decidedAt: number
}

export const COOKIE_NAME = '__cookie_consent'
export const COOKIE_EXPIRY_DAYS = 180
export const CONSENT_VERSION = 1

export function parseConsentCookie(raw: string | null | undefined): CookieConsent | null {
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw) as CookieConsent
        return parsed?.version === CONSENT_VERSION ? parsed : null
    } catch {
        return null
    }
}
