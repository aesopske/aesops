import { useCookie } from '@/src/context/CookiePopupProvider'
import { Box, Button, HStack, Text, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

function CookieBanner() {
    const { colorMode } = useColorMode()
    const { setCookieConsent } = useCookie()
    return (
        <Box
            position='fixed'
            height='auto'
            width={['95%', '', '', '40%', '30%']}
            borderRadius='10px'
            p='10px'
            border='2px solid'
            borderColor={colorMode === 'light' ? 'gray.400' : 'gray.600'}
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            shadow='xl'
            zIndex='50'
            fontSize='sm'
            bottom={['7rem', '', '', '1rem', '2rem']}
            left={['2.5%', '', '', '1rem', '2rem']}>
            <Text>
                We use cookies to improve your experience with us.
                <Link href='/legal/privacy-policy' passHref>
                    <Text
                        cursor='pointer'
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
                    onClick={() => {
                        const consentToken = `Agreed:${Math.random()
                            .toString(36)
                            .substring(4)}`
                        setCookieConsent(consentToken)
                    }}>
                    Accept
                </Button>
            </HStack>
        </Box>
    )
}

export default CookieBanner
