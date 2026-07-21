import './styles/globals.css'
import 'streamdown/styles.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/lora'
import { GeistMono } from 'geist/font/mono'
import { VisualEditing } from 'next-sanity/visual-editing'
import { cookies, draftMode } from 'next/headers'
import TopLoader from 'nextjs-toploader'
import ConsentGatedScripts from '@components/shared/cookie-consent/ConsentGatedScripts'
import { COOKIE_NAME, parseConsentCookie } from '@/lib/shared/cookie-consent-cookie'
import Providers from './_providers'

async function RootLayout({ children }: { children: React.ReactNode }) {
    const { isEnabled } = await draftMode()
    const cookieStore = await cookies()
    const initialCookieConsent = parseConsentCookie(cookieStore.get(COOKIE_NAME)?.value)
    return (
        <html lang='en' suppressHydrationWarning className={GeistMono.variable}>
            <head>
                <meta charSet='utf-8' />
                <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='theme-color' content='#15616D' />
                <meta
                    name='keywords'
                    content='Aesops, data, data organization, data-driven decision-making, innovation, Kenya, data sector, AESOPS, data organization, data-driven decision-making, innovation, Kenya, data sector'
                />
                <link rel='icon' href='/logo-mark.svg' type='image/svg+xml' sizes='32x32' />
            </head>
            <body className=''>
                <Providers initialCookieConsent={initialCookieConsent}>
                    <TopLoader color='#15616D' showSpinner={false} />
                    {children}
                    {isEnabled && <VisualEditing />}
                    <ConsentGatedScripts />
                </Providers>
            </body>
        </html>
    )
}
export default RootLayout
