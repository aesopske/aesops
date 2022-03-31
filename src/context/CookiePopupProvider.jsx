import React, { createContext, useState, useEffect, useContext } from 'react'
import Cookie from 'js-cookie'

const CookieContext = createContext({})

function CookiePopupProvider({ children }) {
    const [consent, setConsent] = useState(null)
    const [showConsent, setShowConsent] = useState(false)

    const setCookieConsent = (consent) => {
        Cookie.set('CookieConsent', consent)
        setConsent(consent)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (consent) {
                setShowConsent(false)
            } else {
                setShowConsent(true)
            }
        }
    }, [consent])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cookieConsent = Cookie.get('CookieConsent')
            if (cookieConsent) {
                setConsent(cookieConsent)
            }
        }
    }, [])

    return (
        <CookieContext.Provider
            value={{ showConsent, consent, setCookieConsent, setShowConsent }}>
            {children}
        </CookieContext.Provider>
    )
}

export const useCookie = () => useContext(CookieContext)

export default CookiePopupProvider
