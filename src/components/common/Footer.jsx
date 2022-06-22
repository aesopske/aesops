import React from 'react'
import Link from 'next/link'
import {
    FaLinkedin,
    FaTwitter,
    FaFacebook,
    FaGithub,
    FaRss,
} from 'react-icons/fa'
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
    VStack,
} from '@chakra-ui/react'

function Footer() {
    const { colorMode } = useColorMode()
    const links = [
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
        {
            label: 'Team',
            link: '/team',
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
        {
            label: 'Rss Feed',
            href: `${process.env.SITE_URL}/rss.xml`,
            icon: FaRss,
        },
    ]

    const legal = [
        {
            label: 'Privacy Policy',
            href: `${process.env.SITE_URL}/legal/privacy-policy`,
        },
    ]
    return (
        <Box
            height='auto'
            p='40px 0'
            borderTop='3px solid'
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}>
            <Grid
                width={['95%', '80%', '80%', '80%', '75%']}
                height='100%'
                mx='auto'
                p='20px 0'
                gap='1rem'
                templateColumns={[
                    'repeat(2,1fr)',
                    'repeat(2,1fr)',
                    'repeat(2,1fr)',
                    'repeat(3,1fr)',
                    'repeat(4,1fr)',
                ]}>
                {/* logo */}

                <GridItem
                    colSpan='1'
                    height='auto'
                    width='100%'
                    display={['none', 'none', 'none', 'block']}>
                    <HStack spacing='5'>
                        <Image
                            src='/svg/aesops-color-1.svg'
                            alt='logo'
                            objectFit='contain'
                            width={['50%', '30%', '30%', '20%']}
                            height={['50%', '30%', '30%', '40%']}
                        />
                        <Heading size='lg'>Aesops</Heading>
                    </HStack>
                </GridItem>

                {/* links */}

                <GridItem
                    colSpan='1'
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    p='0 20px'>
                    <Heading fontSize={['md', '', '', '', '', 'xl']} my='1rem'>
                        Company Links
                    </Heading>
                    <VStack
                        alignItems='flex-start'
                        justify-content='flex-start'
                        spacing='2'>
                        {links.map((link) => (
                            <Box key={link.label}>
                                <Link href={link.link} passHref>
                                    <Text
                                        fontSize={['sm', 'md', '', '', 'lg']}
                                        _hover={{ color: 'brand.muted' }}
                                        cursor='pointer'>
                                        {link.label}
                                    </Text>
                                </Link>
                            </Box>
                        ))}
                    </VStack>
                </GridItem>

                {/* socials */}

                <GridItem
                    colSpan='1'
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    p='0 20px'>
                    <Heading fontSize={['md', '', '', '', '', 'xl']} my='1rem'>
                        Connect with us
                    </Heading>
                    <VStack
                        alignItems='flex-start'
                        justify-content='flex-start'
                        spacing='3'>
                        {socials.map((social) => (
                            <HStack
                                key={social.label}
                                width='100%'
                                _hover={{ color: 'brand.muted' }}>
                                <Icon as={social.icon} fontSize='1rem' />
                                <Text
                                    as='a'
                                    fontSize={['sm', 'md', '', '', 'lg']}
                                    href={social.href}
                                    target='_blank'
                                    rel='noopener noreferrer'>
                                    {social.label}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>
                </GridItem>
                <GridItem
                    colSpan='1'
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    p='0 20px'>
                    <Heading fontSize={['md', '', '', '', '', 'xl']} my='1rem'>
                        Legal
                    </Heading>

                    {legal.map((leg) => (
                        <HStack
                            key={leg.label}
                            my='.5rem'
                            width='100%'
                            _hover={{ color: 'brand.muted' }}>
                            <Text
                                as='a'
                                fontSize={['sm', 'md', '', '', 'lg']}
                                href={leg.href}
                                target='_blank'
                                rel='noopener noreferrer'>
                                {leg.label}
                            </Text>
                        </HStack>
                    ))}
                </GridItem>
            </Grid>

            <Divider
                mx='auto'
                mb='2rem'
                width={['90%', '90%', '80%', '70%', '40%']}
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
            />

            <Text
                my='1rem'
                as='p'
                color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                textTransform='capitalize'
                textAlign='center'>
                all rights reserved {new Date().getFullYear()} &copy;
                <Text as='a' ml='0.5rem' href={`${process.env.SITE_URL}`}>
                    aesops
                </Text>
            </Text>
        </Box>
    )
}

export default Footer
