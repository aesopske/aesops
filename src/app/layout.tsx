import './globals.css'
import Providers from './_providers'

function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body>
                <Providers>
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    )
}
export default RootLayout
