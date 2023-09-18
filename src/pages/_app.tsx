import '../scss/global.scss'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { theme } from '@/lib/chakra'
import '@fontsource/roboto-mono'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto-serif/400.css'
import '@fontsource/roboto-serif/500.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import ContextProvider from '@/context/ContextProvider'
import ProgressBar from '@badrap/bar-of-progress'
import Router from 'next/router'
import { AnimatePresence } from 'framer-motion'

const progress = new ProgressBar({
    size: 4,
    color: '#6f0dcc',
    className: 'progress-bar',
    delay: 50,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <CSSReset />
            <ContextProvider>
                <AnimatePresence mode='wait'>
                    <Component {...pageProps} />
                </AnimatePresence>
            </ContextProvider>
        </ChakraProvider>
    )
}

export default MyApp
