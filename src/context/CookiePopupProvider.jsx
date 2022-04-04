import React, { createContext, useState, useEffect, useContext } from 'react'

const CookieContext = createContext({})

function CookiePopupProvider({ children }) {
    const [consent, setConsent] = useState(null)
    const [showCookieBanner, setShowCookieBanner] = useState(false)

    const setCookieConsent = (consent) => {
        sessionStorage.setItem('cookieConsent', consent)
        setConsent(consent)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (consent) {
                setShowCookieBanner(false)
            } else {
                setShowCookieBanner(true)
            }
        }
    }, [consent])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookieConsent = sessionStorage.getItem('CookieConsent')
            if (cookieConsent) {
                setConsent(cookieConsent)
            }
        }
    }, [])

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

export default CookiePopupProvider
