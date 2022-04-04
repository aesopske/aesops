import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { Router } from 'next/router'
import GA4 from 'react-ga4'

const TrackingContext = createContext({})

function TrackingProvider({ children }) {
    const trackingId = process.env.GA_TRACKING_ID

    const initGA = useCallback(() => {
        if (!GA4.isInitialized && process.env.NODE_ENV === 'production') {
            GA4.initialize(trackingId, {
                gaOptions: {
                    debug: !process.env.NODE_ENV === 'production',
                    siteSpeedSampleRate: 100,
                },
            })
        }
    }, [trackingId])

    const pageView = useCallback((location = window.location.href) => {
        GA4.send({
            hitType: 'pageview',
            page: location,
        })
    }, [])

    function gaEvent(category = '', action = '', label = '', value = '') {
        GA4.event({
            category,
            action,
            label,
            value,
        })
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            initGA()
        }
    }, [initGA])

    const handleRouteChange = useCallback(
        (url) => {
            if (GA4.isInitialized) {
                pageView(url)
            }
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
