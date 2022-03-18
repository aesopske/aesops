import CookiePopupProvider from './CookiePopupProvider'
import TrackingProvider from './TrackingProvider'

function ContextProvider({ children }) {
    return (
        <TrackingProvider>
            <CookiePopupProvider>{children}</CookiePopupProvider>
        </TrackingProvider>
    )
}

export default ContextProvider
