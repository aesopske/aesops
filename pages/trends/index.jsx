import { Box, Heading, Text, useColorMode, VStack } from '@chakra-ui/react'
import Layout from '@/src/components/common/Layout'
import Script from 'next/script'
import PageBanner from '@/src/components/common/PageBanner'

function Trends() {
    const { colorMode } = useColorMode()
    return (
        <Layout title='Aesops - Trends'>
            <Box
                width='80%'
                mx='auto'
                minHeight='40vh'
                mb='2rem'
                as={VStack}
                alignItems='flex-start'
                justifyContent='center'>
                <PageBanner heading='Trending'>
                    <Text
                        as='p'
                        fontSize='1.1rem'
                        width={['100%', '100%', '80%', '', '60%', '45%']}
                        color={colorMode === 'light' ? 'gray.100' : 'gray.400'}>
                        Find out what is trending in a fun, visual and
                        interactive way. We visualize different trending topics
                        using data from different sources.
                    </Text>
                </PageBanner>
                <Heading fontSize='2xl' my='2rem'>
                    The Kenya Tax Burdens
                </Heading>
                <Box height='auto' width={['100%', '100%', '90%', '80%']}>
                    <Box
                        as='iframe'
                        title='The tax burden in Kenya Oil market'
                        aria-label='Interactive line chart'
                        id='datawrapper-chart-mgbmZ'
                        src='https://datawrapper.dwcdn.net/mgbmZ/1/'
                        scrolling='no'
                        frameBorder='0'
                        width={['100%', '100%', '80%', '60%']}
                        fontSize='md'
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
                    <Text as='p' fontSize='md' my='2rem'>
                        Oil price unlike most other commodities affect the
                        entire economy for any country that is reliant on oil
                        for electricity, power and transportation. Kenya is no
                        exception and this is one of the reasons why the EPRA
                        was set up to regulate the pricing of the important
                        commodity. Now although global trends have a big impact
                        on the prices in particular the way in Russia, tax is a
                        great contributor to the high prices being experienced
                        in Kenya. The average tax on the oil products is 40% -
                        45% tax according to the press releases by the EPRA.
                        Below is a plot that shows the tax burden Kenya&apos;s
                        face due for the most part to this taxation which is
                        based on average oil prices and Kenya vs average
                        international price of crude oil
                    </Text>
                </Box>
            </Box>
        </Layout>
    )
}

export default Trends
