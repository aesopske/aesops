import '@app/styles/global.css'
import '@fontsource-variable/lora'
import '@fontsource-variable/bricolage-grotesque'
import Footer from '@/components/common/Footer'
import NewNavbar from '@components/common/NewNavbar'

function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className='bg-gradient-t-b from-aes-light to-aes-primary'>
                <NewNavbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
export default RootLayout
