// import './globals.css'
import '@repo/ui/styles/globals.css'
import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Aesops Auth Gateway',
    description: 'Centralized Authentication for Aesops Ecosystem',
}

export function RootLayout({
    children,
}: Readonly<{
    children: React.JSX.Element
}>): React.JSX.Element {
    return (
        <html lang='en'>
            <body className={bricolage.className}>
                <main className='min-h-screen'>{children}</main>
            </body>
        </html>
    )
}
