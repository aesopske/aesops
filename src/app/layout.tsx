import '@app/styles/global.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/lora'
import { Analytics } from '@vercel/analytics/react'
import { groq, VisualEditing } from 'next-sanity'
import { draftMode } from 'next/headers'
import TopLoader from 'nextjs-toploader'
import Footer from '@/components/common/Footer'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { HOME_SETTINGS } from '@sanity/utils/types'
import NewNavbar from '@components/common/NewNavbar'
import Providers from './_providers'

async function RootLayout({ children }) {
    const homeSettingsQuery = groq` *[_type == "siteSettings"][0] {
        title,
        description,
        keywords,
        ogImage,
    }`
    const page = await sanityFetch<HOME_SETTINGS>({
        query: homeSettingsQuery,
    })

    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <meta name='theme-color' content='#15616D' />
                <meta
                    name='keywords'
                    content={
                        page?.keywords ||
                        'Aesops, data, data organization, data-driven decision-making, innovation, Kenya, data sector, AESOPS, data organization, data-driven decision-making, innovation, Kenya, data sector'
                    }
                />
                <meta
                    name='description'
                    content={page?.description || 'Aesops'}
                />
                <meta property='og:title' content={page?.title || 'Aesops'} />
                <meta
                    property='og:description'
                    content={page?.description || 'Aesops'}
                />
                <meta
                    property='og:image'
                    content={page?.ogImage ? urlForImage(page?.ogImage) : ''}
                />

                <link
                    rel='icon'
                    href='/logo-mark.svg'
                    type='image/svg+xml'
                    sizes='32x32'
                />
            </head>
            <body className=''>
                <Providers>
                    <TopLoader color='#15616D' showSpinner={false} />
                    <NewNavbar previewEnabled={draftMode().isEnabled} />
                    <main>{children}</main>
                    {draftMode().isEnabled && <VisualEditing />}
                    <Footer />
                    <Analytics />
                </Providers>
            </body>
        </html>
    )
}
export default RootLayout
