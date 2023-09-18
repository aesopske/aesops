import React, { useState, useRef } from 'react'
import {
    Grid,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Text,
    Stack,
    useColorMode,
    useOutsideClick,
} from '@chakra-ui/react'
import { CgMenuRight } from 'react-icons/cg'
import { RiTeamFill } from 'react-icons/ri'
import {
    MdGraphicEq,
    MdArticle,
    MdStorage,
    MdApps,
    MdPeopleAlt,
} from 'react-icons/md'
import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import AesopBtn from './atoms/AesopBtn'

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
            label: 'Articles',
            path: '/articles',
            icon: MdArticle,
        },
        {
            label: 'Datasets',
            path: '/datasets',
            icon: MdStorage,
        },
        {
            label: 'Apps',
            path: '/apps',
            icon: MdApps,
        },
        {
            label: 'Community',
            path: '/community',
            icon: MdPeopleAlt,
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
            display={['flex', 'flex', 'none', 'none']}
            ref={ref}
            position='sticky'
            height='auto'
            width='95%'
            borderRadius='10px'
            direction='column'
            justifyContent='space-between'
            alignItems='center'
            bottom='0.5rem'
            left='2.5%'
            zIndex='100'
            mx='auto'>
            <AnimatePresence>
                {isOpen && (
                    <Stack
                        as={motion.div}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        width='100%'
                        direction='column'
                        justifyContent='space-between'
                        borderRadius='10px'
                        p='10px'
                        bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                        border='1px solid'
                        borderColor={
                            colorMode === 'light' ? '#fff' : 'gray.600'
                        }
                        shadow='lg'
                        my='0.5rem'
                        spacing='4'
                        zIndex='40'
                        alignItems='center'>
                        <Grid
                            my='1rem'
                            gap='1rem'
                            width='90%'
                            mx='auto'
                            templateColumns='repeat(3,1fr)'>
                            {navs.map((nav) => {
                                const isActive = router.asPath === nav.path
                                const lightMode = colorMode === 'light'
                                return (
                                    <Link
                                        key={`${nav.label}-${
                                            nav.path
                                        }-${Math.random()}`}
                                        href={nav.path}
                                        passHref>
                                        <Stack
                                            direction='column'
                                            alignItems='center'
                                            bg={
                                                isActive
                                                    ? lightMode
                                                        ? 'brand.50'
                                                        : 'gray.600'
                                                    : 'transparent'
                                            }
                                            p='10px'
                                            borderRadius='xl'
                                            color={
                                                isActive
                                                    ? colorMode === 'dark'
                                                        ? 'brand.400'
                                                        : 'brand.600'
                                                    : colorMode === 'light'
                                                    ? '#444'
                                                    : 'gray.200'
                                            }
                                            justifyContent='center'>
                                            <Icon
                                                as={nav.icon}
                                                fontSize='1.4rem'
                                            />
                                            <Text
                                                fontSize='sm'
                                                fontWeight={
                                                    isActive ? 'bold' : 'normal'
                                                }
                                                fontFamily='Roboto'>
                                                {nav.label}
                                            </Text>
                                        </Stack>
                                    </Link>
                                )
                            })}
                        </Grid>

                        <HStack
                            width='90%'
                            mx='auto'
                            justifyContent='space-between'>
                            <AesopBtn
                                label='Sign in &rarr;'
                                variant='link'
                                as='a'
                                target='_blank'
                                rel='noreferer noopener'
                                href={`${process.env.DASHBOARD_URL}/auth/signin`}
                            />
                            <ThemeSwitcher hasText text='Switch Theme' />
                        </HStack>

                        <AesopBtn
                            as='a'
                            href={`${process.env.DASHBOARD_URL}/auth/signup`}
                            target='_blank'
                            rel='noreferer noopener'
                            minWidth='90%'
                            label='Get started &rarr;'
                        />
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
                                src={
                                    colorMode === 'light'
                                        ? '/images/aesops-logo.png'
                                        : '/images/aesops-logo-muted.png'
                                }
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
                        aria-label='Navigation menu mobile'
                        icon={<CgMenuRight />}
                        colorScheme='brand'
                        color='#fff'
                        fontSize='1.2rem'
                        borderRadius='10px'
                        onClick={toggle}
                    />
                </HStack>
            </AnimatePresence>
        </Stack>
    )
}

export default NavbarMobile
