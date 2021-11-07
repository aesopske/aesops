import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { initialize, set, pageview, event } from 'react-ga'

const TrackingContext = createContext({})

function TrackingProvider({ children }) {
    let trackingId

    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
        trackingId = ''
    } else {
        trackingId = process.env.trackingId
    }

    const initGA = useCallback(() => {
        initialize(trackingId)
    }, [trackingId])

    const pageView = useCallback((location = window.location.href) => {
        set(location)
        pageview(location)
    }, [])

    function gaEvent(category, action, label) {
        event({ category, action, label })
    }

    useEffect(() => {
        initGA()
    }, [initGA])

    return (
        <TrackingContext.Provider value={{ pageView, gaEvent }}>
            {children}
        </TrackingContext.Provider>
    )
}

export const useGa = () => useContext(TrackingContext)

export default TrackingProvider
