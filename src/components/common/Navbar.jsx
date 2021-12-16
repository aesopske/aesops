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
import { useMediaQuery } from 'react-responsive'
import NavbarMobile from './NavbarMobile'
import ThemeSwitcher from './ThemeSwitcher'
import { useRouter } from 'next/router'

function Navbar() {
    const mobileScreen = useMediaQuery({
        query: '(max-width: 1024px)',
    })

    const router = useRouter()
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
        {
            label: 'Team',
            path: '/team',
        },
    ]

    return (
        <>
            {mobileScreen ? (
                <NavbarMobile />
            ) : (
                <Box height='5rem' width='100%'>
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
                                <Heading size='md'>Aesops</Heading>
                            </HStack>
                        </Link>

                        <HStack
                            spacing={['', '', '4', '5', '4', '6']}
                            width='auto'>
                            <Box
                                as={HStack}
                                spacing={['', '', '4', '5', '5', '6']}
                                width='auto'>
                                {nav.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.path}
                                        passHref>
                                        <Text
                                            as='span'
                                            fontSize={[
                                                '',
                                                '',
                                                '',
                                                '1rem',
                                                '1rem',
                                                '1.1rem',
                                            ]}
                                            color={
                                                router.asPath === item.path
                                                    ? 'brand.primary'
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
                                    fontSize={[
                                        '',
                                        '',
                                        '',
                                        '1rem',
                                        '1rem',
                                        '1.1rem',
                                    ]}
                                    rel='noopener noreferer'
                                    width='auto'>
                                    Sign In &rarr;
                                </Text>

                                <Button
                                    as='a'
                                    href={`${process.env.DASHBOARD_URL}/auth/signup`}
                                    target='_blank'
                                    rel='noopener noreferer'
                                    fontSize={[
                                        '',
                                        '',
                                        '',
                                        '',
                                        '0.9rem',
                                        '1rem',
                                    ]}
                                    fontWeight='500'
                                    color='#fff'
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
                                    height={['', '', '', '', '2.5rem', '3rem']}
                                    borderRadius='10px'
                                    width='auto'
                                    minWidth='40%'>
                                    Get started &rarr;
                                </Button>
                            </HStack>
                        </HStack>
                    </Box>
                </Box>
            )}
        </>
    )
}

export default Navbar
