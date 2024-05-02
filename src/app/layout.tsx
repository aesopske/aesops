import '@app/styles/global.css'
import '@fontsource-variable/lora'
import '@fontsource-variable/bricolage-grotesque'

import TopLoader from 'nextjs-toploader'

import Footer from '@/components/common/Footer'
import NewNavbar from '@components/common/NewNavbar'

function RootLayout({ children }) {
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
                    content='Aesops, data, data organization, data-driven decision-making, innovation, Kenya, data sector, AESOPS, data organization, data-driven decision-making, innovation, Kenya, data sector'
                />
                <meta
                    name='description'
                    content='Are you looking to get insights for your data and make data-driven decisions? Aesops is a pioneering data organization based in Kenya, dedicated to revolutionizing the data sector in the country. AESOPS has rapidly evolved into a dynamic platform that collects, curates, and disseminates data, fostering a culture of data-driven decision-making and innovation.'
                />
                <title>Aesops - Unveiling insights</title>
                <link
                    rel='icon'
                    href='/logo-mark.svg'
                    type='image/svg+xml'
                    sizes='32x32'
                />
            </head>
            <body className=''>
                <TopLoader color='#15616D' showSpinner={false} />
                <NewNavbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
export default RootLayout
