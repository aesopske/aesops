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
        <Box
            height='5rem'
            width='100%'
            position='sticky'
            top='0'
            left='0'
            bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
            borderBottom={colorMode === 'light' ? '1px solid' : '1px solid'}
            borderColor={colorMode === 'light' ? 'gray.300' : 'gray.800'}
            zIndex='60'
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
                                colorMode === 'light'
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
                    <Box
                        as={HStack}
                        spacing={['', '', '2', '3', '5']}
                        width='auto'>
                        {nav.map((item) => (
                            <Link key={item.label} href={item.path} passHref>
                                <Text
                                    as='span'
                                    fontSize={['md', 'md', 'md', 'md', 'lg']}
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
                            fontSize={['md', 'md', 'md', 'md', 'lg']}
                            onClick={() => {
                                gaEvent({
                                    category: 'Auth',
                                    action: 'Clicked sign in',
                                    label: 'signin',
                                })
                            }}
                            rel='noopener noreferer'
                            width='auto'>
                            Sign In
                        </Text>

                        <Button
                            as='a'
                            href={`${process.env.DASHBOARD_URL}/auth/signup`}
                            target='_blank'
                            rel='noopener noreferer'
                            fontSize={['md', 'md', 'md', 'md', 'lg']}
                            fontWeight='500'
                            color='#fff'
                            onClick={() => {
                                gaEvent({
                                    category: 'Auth',
                                    action: 'Clicked sign up',
                                    label: 'signup',
                                })
                            }}
                            bg={
                                colorMode === 'light'
                                    ? 'brand.primary'
                                    : 'brand.muted'
                            }
                            _hover={{
                                bg:
                                    colorMode === 'light'
                                        ? 'brand.primary'
                                        : 'brand.hover',
                            }}
                            _focus={{
                                bg:
                                    colorMode === 'light'
                                        ? 'brand.primary'
                                        : 'brand.muted',
                            }}
                            _active={{
                                bg:
                                    colorMode === 'light'
                                        ? 'brand.primary'
                                        : 'brand.muted',
                            }}
                            height={['', '', '2.5rem', '2.5rem', '3rem']}
                            borderRadius='10px'
                            width='auto'
                            minWidth='40%'>
                            Get started &rarr;
                        </Button>
                    </HStack>
                </HStack>
            </Box>
        </Box>
    )
}

export default Navbar
