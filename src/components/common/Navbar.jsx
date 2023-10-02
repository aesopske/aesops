import React from 'react'
import Link from 'next/link'
import {
    Box,
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
import AesopBtn from './atoms/AesopBtn'

function Navbar() {
    const router = useRouter()
    const { gaEvent } = useGa()
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    const nav = [
        {
            label: 'Articles',
            path: '/articles',
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
        <Box position='sticky' top='0' left='0' zIndex='60'>
            <Box
                height='5rem'
                width='100%'
                bg={!isDark ? 'gray.100' : 'gray.800'}
                borderBottom={!isDark ? '1px solid' : '1px solid'}
                borderColor={!isDark ? 'gray.300' : 'gray.700'}
                display={['none', 'none', 'block', 'block']}>
                <Box
                    as={Stack}
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    height='100%'
                    width={['90%', '90%', '90%', '80%', '', '75%']}
                    mx='auto'>
                    <Link href='/' passHref>
                        <HStack width='auto' cursor='pointer'>
                            <Image
                                width='60px'
                                height='50px'
                                objectFit='contain'
                                src={
                                    !isDark
                                        ? '/images/aesops-logo.png'
                                        : '/images/aesops-logo-muted.png'
                                }
                                alt='Aesops Logo'
                                aria-label='Aesops Logo'
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
                        <HStack spacing={['', '', '2', '3', '5']} width='auto'>
                            {nav.map((item) => {
                                const isActive = router.asPath === item.path
                                const lightMode = !isDark
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.path}
                                        passHref>
                                        <Text
                                            as='span'
                                            fontSize='md'
                                            fontFamily='Roboto'
                                            color={
                                                isActive
                                                    ? lightMode
                                                        ? 'brand.600'
                                                        : 'brand.200'
                                                    : lightMode
                                                    ? 'gray.600'
                                                    : 'gray.300'
                                            }
                                            fontWeight={
                                                router.asPath === item.path
                                                    ? '700'
                                                    : '500'
                                            }
                                            _hover={{}}
                                            cursor='pointer'>
                                            {item.label}
                                        </Text>
                                    </Link>
                                )
                            })}
                        </HStack>

                        <Text> | </Text>

                        <HStack spacing='8' width='auto'>
                            <ThemeSwitcher />

                            <AesopBtn
                                variant='link'
                                label='Sign In'
                                as='a'
                                href={`${process.env.DASHBOARD_URL}/auth/signin`}
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
                            />

                            <AesopBtn
                                isLink
                                onClick={() => {
                                    gaEvent({
                                        category: 'Auth',
                                        action: 'Clicked sign up',
                                        label: 'signup',
                                    })
                                }}
                                label='Get started &rarr;'
                                as='a'
                                target='_blank'
                                rel='noopener noreferer'
                                href={`${process.env.DASHBOARD_URL}/auth/signup`}
                                height={['', '', '2.5rem', '2.5rem', '3rem']}
                            />
                        </HStack>
                    </HStack>
                </Box>
            </Box>
        </Box>
    )
}

export default Navbar
