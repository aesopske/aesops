import CookiePopupProvider from './CookiePopupProvider'
// import TrackingProvider from './TrackingProvider'

function ContextProvider({ children }) {
    return (
        // <TrackingProvider>
        // </TrackingProvider>
        <CookiePopupProvider>{children}</CookiePopupProvider>
    )
}

export default ContextProvider
