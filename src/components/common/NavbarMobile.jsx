import React, { useState, useRef } from 'react'
import {
    Grid,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Text,
    Button,
    Stack,
    useColorMode,
    useOutsideClick,
} from '@chakra-ui/react'
import { CgMenuRight } from 'react-icons/cg'
import { FaAppStoreIos, FaDatabase, FaUsers } from 'react-icons/fa'
import { RiTeamFill } from 'react-icons/ri'
import { MdGraphicEq, MdArticle } from 'react-icons/md'
import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'
import { useRouter } from 'next/router'

function NavbarMobile() {
    const ref = useRef()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const { colorMode } = useColorMode()

    const toggle = () => {
        setIsOpen((prevState) => !prevState)
    }
    const toggleOff = () => {
        setIsOpen(false)
    }

    useOutsideClick({
        ref: ref,
        handler: () => toggleOff(),
    })

    const navs = [
        {
            label: 'Fables',
            path: '/fables',
            icon: MdArticle,
        },
        {
            label: 'Data',
            path: '/data',
            icon: FaDatabase,
        },
        {
            label: 'Apps',
            path: '/apps',
            icon: FaAppStoreIos,
        },
        {
            label: 'Community',
            path: '/community',
            icon: FaUsers,
        },
        {
            label: 'Trendsboard',
            path: '/trends',
            icon: MdGraphicEq,
        },
        {
            label: 'Team',
            path: '/team',
            icon: RiTeamFill,
        },
    ]

    return (
        <Stack
            display={['flex', 'flex', 'flex', 'none']}
            ref={ref}
            position='fixed'
            height='auto'
            width='95%'
            my='1rem'
            direction='column'
            justifyContent='space-between'
            alignItems='center'
            shadow='base'
            bottom='0rem'
            left='2.5%'
            zIndex='30'
            mx='auto'>
            {isOpen && (
                <Stack
                    width='100%'
                    direction='column'
                    justifyContent='space-between'
                    borderRadius='10px'
                    p='10px'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    border='1px solid'
                    borderColor={colorMode === 'light' ? '#fff' : 'gray.600'}
                    shadow='lg'
                    my='0.5rem'
                    spacing='6'
                    zIndex='40'
                    alignItems='center'>
                    <Grid
                        my='1rem'
                        gap='1.5rem'
                        templateColumns='repeat(3,1fr)'>
                        {navs.map((nav) => (
                            <Link
                                className='navitem'
                                key={nav.label}
                                href={nav.path}
                                passHref>
                                <Stack
                                    direction='column'
                                    alignItems='center'
                                    color={
                                        router.asPath === nav.path
                                            ? colorMode === 'dark'
                                                ? 'brand.muted'
                                                : 'brand.primary'
                                            : colorMode === 'light'
                                            ? '#444'
                                            : 'gray.200'
                                    }
                                    justifyContent='center'>
                                    <Icon as={nav.icon} fontSize='1.4rem' />
                                    <Text fontSize='0.9rem'>{nav.label}</Text>
                                </Stack>
                            </Link>
                        ))}
                    </Grid>

                    <HStack
                        width='80%'
                        mx='auto'
                        justifyContent='space-between'>
                        <Text
                            as='a'
                            target='_blank'
                            rel='noreferer noopener'
                            href={`${process.env.DASHBOARD_URL}/auth/signin`}
                            _hover={{ color: 'brand.muted' }}>
                            Sign in &rarr;
                        </Text>
                        <ThemeSwitcher hasText text='Switch Theme' />
                    </HStack>

                    <Button
                        as='a'
                        href={`${process.env.DASHBOARD_URL}/auth/signup`}
                        color='#fff'
                        bg='brand.primary'
                        _hover={{ bg: 'brand.primary' }}
                        height='3rem'
                        target='_blank'
                        rel='noreferer noopener'
                        borderRadius='10px'
                        width='80%'
                        mx='auto'>
                        Get started &rarr;
                    </Button>
                </Stack>
            )}
            <HStack
                width='100%'
                justifyContent='space-between'
                alignItems='center'
                bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                border='1px solid'
                borderColor={colorMode === 'light' ? '#fff' : 'gray.600'}
                shadow='lg'
                height='5rem'
                borderRadius='10px'
                p='10px'>
                <Link href='/' passHref>
                    <HStack>
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

                <IconButton
                    icon={<CgMenuRight />}
                    bg='brand.primary'
                    _focus={{ bg: 'brand.primary', outline: 'none' }}
                    _hover={{ bg: 'brand.primary' }}
                    color='#fff'
                    fontSize='1.2rem'
                    borderRadius='10px'
                    onClick={toggle}
                />
            </HStack>
        </Stack>
    )
}

export default NavbarMobile
