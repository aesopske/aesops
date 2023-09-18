import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { Router } from 'next/router'

declare global {
    // eslint-disable-next-line
    interface Window {
        gtag: any
    }
}

const TrackingContext = createContext({})

function TrackingProvider({ children }) {
    const trackingId = process.env.GA_TRACKING_ID

    const pageView = useCallback(
        (location = window.location.href) => {
            window.gtag('config', trackingId, {
                page_path: location,
            })
        },
        [trackingId]
    )

    function gaEvent(category = '', action = '', label = '', value = '') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value,
        })
    }

    const handleRouteChange = useCallback(
        (url: string) => {
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
