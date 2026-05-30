import './styles/globals.css'
import 'streamdown/styles.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/lora'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import TopLoader from 'nextjs-toploader'
import Providers from './_providers'

async function RootLayout({ children }: { children: React.ReactNode }) {
    const { isEnabled } = await draftMode()
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
                <Providers>
                    <TopLoader color='#15616D' showSpinner={false} />
                    {children}
                    {isEnabled && <VisualEditing />}
                </Providers>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
export default RootLayout
