import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'

type CookieContextType = {
    showCookieBanner: boolean
    consent: boolean
    setCookieConsent: (consent: boolean) => void // eslint-disable-line
    setShowCookieBanner: (show: boolean) => void // eslint-disable-line
}

const CookieContext = createContext<CookieContextType>({
    showCookieBanner: false,
    consent: false,
    setCookieConsent: () => null,
    setShowCookieBanner: () => null,
})

function CookieProvider({ children }) {
    const [consent, setConsent] = useState(false)
    const [showCookieBanner, setShowCookieBanner] = useState(false)

    const setCookieConsent = (consent: boolean) => {
        Cookies.set('cookieConsent', consent)
        setConsent(consent)
        setShowCookieBanner(false)
    }

    const cookieConsent = Cookies.get('cookieConsent')
    useEffect(() => {
        if (!cookieConsent) {
            setTimeout(() => {
                setShowCookieBanner(true)
            }, 3000)
        }
    }, [cookieConsent])

    return (
        <CookieContext.Provider
            value={{
                showCookieBanner,
                consent,
                setCookieConsent,
                setShowCookieBanner,
            }}>
            {children}
        </CookieContext.Provider>
    )
}

export const useCookie = () => useContext(CookieContext)

export default CookieProvider
