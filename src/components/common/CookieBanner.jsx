import { useCookie } from '@/src/context/CookieProvider'
import {
    Box,
    Button,
    Heading,
    HStack,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { Slide } from 'react-reveal'

function CookieBanner() {
    const { colorMode } = useColorMode()
    const { setCookieConsent } = useCookie()

    const AcceptCookies = () => {
        const consentToken = `Agreed:${Math.random().toString(36).substring(4)}`
        setCookieConsent(consentToken)
    }
    return (
        <Box
            width='auto'
            position='fixed'
            height='auto'
            zIndex='50'
            bottom={['7rem', '', '1rem', '1rem', '2rem']}
            left={['2.5%', '', '', '1rem', '2rem']}>
            <Slide left>
                <Box
                    width={['95%', '', '50%']}
                    borderRadius='10px'
                    p='10px 20px'
                    border='2px solid'
                    borderColor={
                        colorMode === 'light' ? 'gray.300' : 'gray.700'
                    }
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    shadow='2xl'
                    fontSize='sm'>
                    <Heading fontSize='lg' my='0.5rem'>
                        We value privacy
                    </Heading>
                    <Text>
                        We use cookies to improve your browsing experience, and
                        analyze our traffic. By clicking &quot;Accept&quot; you
                        give your consent to our use of these cookies.
                        <Link href='/legal/privacy-policy' passHref>
                            <Text
                                cursor='pointer'
                                textDecoration='underline'
                                color={
                                    colorMode === 'light'
                                        ? 'brand.primary'
                                        : 'brand.muted'
                                }>
                                Privacy Policy
                            </Text>
                        </Link>
                    </Text>
                    <HStack my='1rem' justifyContent='flex-start'>
                        <Button
                            height='2rem'
                            colorScheme='purple'
                            fontSize='sm'
                            fontWeight='400'
                            _focus={{ outline: 'none' }}
                            _active={{ outline: 'none' }}
                            onClick={AcceptCookies}>
                            Accept
                        </Button>
                    </HStack>
                </Box>
            </Slide>
        </Box>
    )
}

export default CookieBanner
