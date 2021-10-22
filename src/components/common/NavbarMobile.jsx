import React, { useState } from 'react'
import {
    Box,
    Grid,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Text,
    Button,
    Stack,
} from '@chakra-ui/react'
import { CgMenuRight } from 'react-icons/cg'
import {
    FaAppStoreIos,
    FaDatabase,
    FaFileAlt,
    FaUsers,
    FaQuestionCircle,
} from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import Link from 'next/link'

function NavbarMobile() {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen((prevState) => !prevState)
    }

    const navs = [
        {
            label: 'Articles',
            path: '/articles',
            icon: FaFileAlt,
        },
        {
            label: 'Datasets',
            path: '/datasets',
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
            path: '/trendsboard',
            icon: MdDashboard,
        },
        {
            label: 'About',
            path: '/about',
            icon: FaQuestionCircle,
        },
    ]

    return (
        <Box
            position='fixed'
            as={Stack}
            height='auto'
            bottom='1.5rem'
            width='95%'
            direction='column'
            justifyContent='space-between'
            alignItems='center'
            shadow='lg'
            left='2.5%'
            zIndex='30'>
            {isOpen && (
                <Stack
                    width='100%'
                    direction='column'
                    justifyContent='space-between'
                    borderRadius='10px'
                    p='10px'
                    bg='#fff'
                    border='1px solid #eee'
                    shadow='lg'
                    my='0.5rem'
                    alignItems='center'>
                    <Grid
                        my='1rem'
                        gap='1.5rem'
                        p='10px'
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
                                    justifyContent='center'>
                                    <Icon as={nav.icon} fontSize='1.4rem' />
                                    <Text fontSize='0.9rem'>{nav.label}</Text>
                                </Stack>
                            </Link>
                        ))}
                    </Grid>

                    <Button
                        as='a'
                        href='https://aesops.co.ke/signin'
                        color='#fff'
                        bg='brand.primary'
                        _hover={{ bg: 'brand.primary' }}
                        height='3rem'
                        borderRadius='10px'
                        width='90%'
                        mx='auto'>
                        Login
                    </Button>
                </Stack>
            )}
            <HStack
                width='100%'
                justifyContent='space-between'
                alignItems='center'
                bg='#fff'
                border='1px solid #eee'
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
                        <Heading size='sm' color='#444'>
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
        </Box>
    )
}

export default NavbarMobile
