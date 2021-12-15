import React from 'react'
import Link from 'next/link'
import { FaLinkedin, FaTwitter, FaFacebook, FaGithub } from 'react-icons/fa'
import {
    Heading,
    Box,
    Text,
    HStack,
    Icon,
    Divider,
    Image,
    GridItem,
    useColorMode,
    Grid,
} from '@chakra-ui/react'

function Footer() {
    const { colorMode } = useColorMode()
    const links = [
        {
            label: 'Home',
            link: '/',
        },
        {
            label: 'Articles',
            link: '/articles',
        },
        {
            label: 'Datasets',
            link: '/datasets',
        },
        {
            label: 'Apps',
            link: '/apps',
        },
        {
            label: 'Community',
            link: '/community',
        },
        {
            label: 'Trends',
            link: '/trends',
        },
    ]
    const socials = [
        {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/company/aesops/',
            icon: FaLinkedin,
        },
        {
            label: 'Github',
            href: 'https://github.com/aesopske',
            icon: FaGithub,
        },
        {
            label: 'Twitter',
            href: 'https://twitter.com/Aesopsk',
            icon: FaTwitter,
        },
        {
            label: 'Facebook',
            href: 'https://facebook.com/aesopske',
            icon: FaFacebook,
        },
    ]
    return (
        <Box
            height='auto'
            p='40px 0'
            borderTop='1px solid'
            borderColor={colorMode === 'light' ? '#eee' : 'gray.700'}>
            <Grid
                width={['95%', '80%']}
                height='100%'
                mx='auto'
                p='20px 0'
                gap='1rem'
                templateColumns={[
                    'repeat(1,1fr)',
                    'repeat(1,1fr)',
                    'repeat(2,1fr)',
                    'repeat(3,1fr)',
                    'repeat(4,1fr)',
                ]}>
                {/* logo */}

                <GridItem colSpan='1' height='auto' width='100%'>
                    <Image
                        src='/svg/aesops-color-1.svg'
                        alt='logo'
                        objectFit='contain'
                        width={['50%', '30%', '30%', '30%']}
                        height={['50%', '30%', '30%', '40%']}
                    />
                </GridItem>

                {/* links */}

                <GridItem
                    colSpan='1'
                    color={colorMode === 'light' ? '#555' : 'whiteAlpha.700'}
                    p='0 20px'>
                    <Heading size='md' my='1rem'>
                        Links
                    </Heading>
                    {links.map((link) => (
                        <Box my='0.5rem' key={link.label}>
                            <Link href={link.link} passHref>
                                <Text
                                    fontSize='0.9rem'
                                    my='.5rem'
                                    _hover={{ color: 'brand.muted' }}
                                    cursor='pointer'>
                                    &rarr; {link.label}
                                </Text>
                            </Link>
                        </Box>
                    ))}
                </GridItem>

                {/* socials */}

                <GridItem
                    colSpan='1'
                    color={colorMode === 'light' ? '#555' : 'whiteAlpha.700'}
                    p='0 20px'>
                    <Heading size='md' my='1rem'>
                        Connect with us
                    </Heading>

                    {socials.map((social) => (
                        <HStack
                            key={social.label}
                            my='1rem'
                            width='100%'
                            _hover={{ color: 'brand.muted' }}>
                            <Icon
                                as={social.icon}
                                fontSize='1.2rem'
                                mr='1rem'
                            />
                            <Text
                                as='a'
                                fontSize='0.9rem'
                                href={social.href}
                                target='_blank'
                                rel='noopener noreferrer'>
                                {social.label}
                            </Text>
                        </HStack>
                    ))}
                </GridItem>
            </Grid>

            <Divider
                mx='auto'
                mb='2rem'
                width={['90%', '90%', '80%', '70%', '40%']}
                borderColor={colorMode === 'light' ? '#eee' : 'gray.700'}
            />

            <Text
                my='1rem'
                as='p'
                color={colorMode === 'light' ? 'gray.600' : 'gray.500'}
                textTransform='uppercase'
                textAlign='center'>
                all rights reserved {new Date().getFullYear()} &copy;
                aesops.co.ke
            </Text>
        </Box>
    )
}

export default Footer
