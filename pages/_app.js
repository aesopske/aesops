import '../scss/global.scss'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { theme } from '../src/utils/chakra.config'
import '@fontsource/pt-sans/400.css'
import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/800.css'
import '@fontsource/fira-mono/400.css'
import ContextProvider from '../src/context/ContextProvider'
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
                <AnimatePresence exitBeforeEnter>
                    <Component {...pageProps} />
                </AnimatePresence>
            </ContextProvider>
        </ChakraProvider>
    )
}

export default MyApp
