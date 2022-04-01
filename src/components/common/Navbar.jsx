import React from 'react'
import Link from 'next/link'

import {
    Box,
    Button,
    Heading,
    HStack,
    Image,
    Stack,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import ThemeSwitcher from './ThemeSwitcher'
import { useRouter } from 'next/router'
import { useGa } from '@/src/context/TrackingProvider'

function Navbar() {
    const router = useRouter()
    const { gaEvent } = useGa()
    const { colorMode } = useColorMode()

    const nav = [
        {
            label: 'Fables',
            path: '/fables',
        },
        {
            label: 'Datasets',
            path: '/datasets',
        },
        {
            label: 'Apps',
            path: '/apps',
        },
        {
            label: 'Community',
            path: '/community',
        },
        {
            label: 'Trends',
            path: '/trends',
        },
    ]

    return (
        <>
            <Box
                height='5rem'
                width='100%'
                position='sticky'
                bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
                zIndex='60'
                display={['none', 'none', 'block', 'block']}>
                <Box
                    as={Stack}
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    height='100%'
                    width='80%'
                    mx='auto'>
                    <Link href='/' passHref>
                        <HStack width='auto' cursor='pointer'>
                            <Image
                                width='60px'
                                height='50px'
                                objectFit='contain'
                                src='/svg/aesops-color-1.svg'
                                alt='logo'
                            />
                            <Heading
                                size='md'
                                color={
                                    router.asPath === '/'
                                        ? colorMode === 'dark'
                                            ? 'brand.muted'
                                            : 'brand.primary'
                                        : colorMode === 'dark'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }>
                                Aesops
                            </Heading>
                        </HStack>
                    </Link>

                    <HStack spacing={['', '', '2', '3', '4', '6']} width='auto'>
                        <Box
                            as={HStack}
                            spacing={['', '', '2', '3', '5']}
                            width='auto'>
                            {nav.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.path}
                                    passHref>
                                    <Text
                                        as='span'
                                        fontSize='md'
                                        color={
                                            router.asPath === item.path
                                                ? colorMode === 'dark'
                                                    ? 'brand.muted'
                                                    : 'brand.primary'
                                                : colorMode === 'light'
                                                ? '#444'
                                                : 'gray.200'
                                        }
                                        fontWeight={
                                            router.asPath === item.path
                                                ? '700'
                                                : '500'
                                        }
                                        cursor='pointer'>
                                        {item.label}
                                    </Text>
                                </Link>
                            ))}
                        </Box>

                        <Text> | </Text>

                        <HStack spacing='8' width='auto'>
                            <ThemeSwitcher />
                            <Text
                                as='a'
                                href={`${process.env.DASHBOARD_URL}/auth/signin`}
                                _hover={{ color: 'brand.muted' }}
                                target='_blank'
                                fontSize='md'
                                onClick={() => {
                                    gaEvent({
                                        category: 'Auth',
                                        action: 'Clicked sign in',
                                        label: 'signin',
                                    })
                                }}
                                rel='noopener noreferer'
                                width='auto'>
                                Sign In &rarr;
                            </Text>

                            <Button
                                as='a'
                                href={`${process.env.DASHBOARD_URL}/auth/signup`}
                                target='_blank'
                                rel='noopener noreferer'
                                fontSize='md'
                                fontWeight='500'
                                color='#fff'
                                onClick={() => {
                                    gaEvent({
                                        category: 'Auth',
                                        action: 'Clicked sign up',
                                        label: 'signup',
                                    })
                                }}
                                bg='brand.primary'
                                _hover={{
                                    bg: 'brand.primary',
                                }}
                                _focus={{
                                    bg: 'brand.primary',
                                    outline: 'none',
                                }}
                                _active={{
                                    bg: 'brand.primary',
                                    outline: 'none',
                                }}
                                height={['', '', '2.5rem']}
                                borderRadius='10px'
                                width='auto'
                                minWidth='40%'>
                                Get started &rarr;
                            </Button>
                        </HStack>
                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default Navbar
