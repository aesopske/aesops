import { Box, Heading, VStack } from '@chakra-ui/react'
import Layout from '@/src/components/common/Layout'
import Script from 'next/script'

function Trends() {
    return (
        <Layout title='Aesops - Trends'>
            <Box
                width='80%'
                mx='auto'
                minHeight='40vh'
                p='50px'
                as={VStack}
                alignItems='flex-start'
                justifyContent='center'>
                <Heading fontSize='2xl' my='1rem'>
                    Kenya Oil Market
                </Heading>
                <Box height='auto' width='80%'>
                    <Box
                        as='iframe'
                        title='The tax burden in Kenya Oil market'
                        ariaLabel='Interactive line chart'
                        id='datawrapper-chart-mgbmZ'
                        src='https://datawrapper.dwcdn.net/mgbmZ/1/'
                        scrolling='no'
                        frameBorder='0'
                        width='60%'
                        minWidth='100%'
                        border='none'
                        height='514'
                    />

                    <Script
                        id='gtm'
                        strategy='afterInteractive'
                        dangerouslySetInnerHTML={{
                            __html: `
           !function(){"use strict";window.addEventListener("message",(function(e){if(void 0!==e.data["datawrapper-height"]){var t=document.querySelectorAll("iframe");for(var a in e.data["datawrapper-height"])for(var r=0;r<t.length;r++){if(t[r].contentWindow===e.source)t[r].style.height=e.data["datawrapper-height"][a]+"px"}}}))}();
          `,
                        }}
                    />
                </Box>
            </Box>
        </Layout>
    )
}

export default Trends
