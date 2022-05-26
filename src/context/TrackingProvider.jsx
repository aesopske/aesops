import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { Router } from 'next/router'

const TrackingContext = createContext({})

function TrackingProvider({ children }) {
    const trackingId = process.env.GA_TRACKING_ID

    const pageView = useCallback(
        (location = window.location.href) => {
            if (typeof window !== 'undefined') {
                window.gtag('config', trackingId, {
                    page_path: location,
                })
            }
        },
        [trackingId]
    )

    function gaEvent(category = '', action = '', label = '', value = '') {
        if (typeof window !== 'undefined') {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value,
            })
        }
    }

    const handleRouteChange = useCallback(
        (url) => {
            pageView(url)
        },
        [pageView]
    )

    useEffect(() => {
        Router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [handleRouteChange])

    return (
        <TrackingContext.Provider value={{ pageView, gaEvent }}>
            {children}
        </TrackingContext.Provider>
    )
}

export const useGa = () => useContext(TrackingContext)

export default TrackingProvider
