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
import Script from 'next/script'

const progress = new ProgressBar({
    size: 3,
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
                <Component {...pageProps} />
            </ContextProvider>
        </ChakraProvider>
    )
}

export default MyApp
