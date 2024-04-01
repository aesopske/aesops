import '@/scss/global.scss'
import '@fontsource-variable/lora'
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
