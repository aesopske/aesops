import TrackingProvider from './TrackingProvider'

function ContextProvider({ children }) {
    return <TrackingProvider>{children}</TrackingProvider>
}

export default ContextProvider
