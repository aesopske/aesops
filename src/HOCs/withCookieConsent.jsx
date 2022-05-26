import * as React from 'react'
import { useCookie } from '../context/CookieProvider'

export const withCookieConsent = (WrappedComponent) => {
    function CookieComponent(props) {
        const { setShowCookieBanner } = useCookie()

        React.useEffect(() => {
            if (props.cookies?.cookieConsent) {
                setShowCookieBanner(false)
            } else {
                setTimeout(() => {
                    setShowCookieBanner(true)
                }, 4000)
            }
        }, [props.cookies?.cookieConsent, setShowCookieBanner])

        return <WrappedComponent {...props} />
    }

    CookieComponent.getInitialProps = async (ctx) => {
        return {
            cookies: ctx.req ? ctx.req.cookies : null,
        }
    }

    return CookieComponent
}
