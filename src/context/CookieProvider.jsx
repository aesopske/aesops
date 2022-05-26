import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'

const CookieContext = createContext({})

function CookieProvider({ children }) {
    const [consent, setConsent] = useState(null)
    const [showCookieBanner, setShowCookieBanner] = useState(false)

    const setCookieConsent = (consent) => {
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
