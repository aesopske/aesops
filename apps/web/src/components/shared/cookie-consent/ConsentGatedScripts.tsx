'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useCookieConsent } from '@/lib/shared/cookie-consent'

function ConsentGatedScripts() {
    const { analyticsEnabled } = useCookieConsent()

    if (!analyticsEnabled) return null

    return (
        <>
            <Analytics />
            <SpeedInsights />
        </>
    )
}

export default ConsentGatedScripts
