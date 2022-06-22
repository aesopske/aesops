import React from 'react'
import {
    Button,
    Text,
    Box,
    Heading,
    useColorMode,
    AvatarGroup,
    Avatar,
    VStack,
    useMediaQuery,
} from '@chakra-ui/react'
import Link from 'next/link'
import { profiles } from '@/src/utils/team'

function About() {
    const { colorMode } = useColorMode()
    const [isTabletAndUp] = useMediaQuery('(min-width: 768px)')
    return (
        <Box
            width={['100%', '90%', '80%', '', '75%']}
            mx='auto'
            height='auto'
            p={['20px 0', '30px 0', '50px 0']}
            my={['1rem', '1rem', '2rem', '3rem', '5rem']}>
            <VStack
                mx='auto'
                height='100%'
                width={['95%', '90%', '90%', '80%']}
                spacing='8'
                direction={[
                    'column-reverse',
                    'column-reverse',
                    'column-reverse',
                    'row',
                ]}
                alignItems='center'
                justifyContent='space-between'>
                <Heading fontSize={['2xl', '', '', '', '3xl', '4xl']}>
                    Who is Aesops?
                </Heading>
                <Text
                    width='100%'
                    as='p'
                    my='1rem'
                    fontSize={['lg', '', '', '', '', 'xl']}
                    textAlign='center'
                    color={colorMode === 'light' ? '#555' : '#f4f4f4'}>
                    We are a Kenyan data organization with the dream of
                    revolutionizing the Kenyan data sector. Started in 2018, but
                    officially in 2020 we created a website for the public and
                    have been adding new users and partners since. We collect
                    data, curate it, and share it with our users to encourage
                    them to use it in creating data applications, analysis, or
                    for their general information.
                </Text>
                <Text
                    width='100%'
                    as='p'
                    my='1rem'
                    textAlign='center'
                    fontSize={['lg', '', '', '', '', 'xl']}
                    color={colorMode === 'light' ? '#555' : '#f4f4f4'}>
                    We also share data-driven articles where we analyze the
                    state of the art technologies in Kenya and in the region
                    with the aim of creating a silicon savanna right here in
                    Kenya. We also display datasets using lovely dashboards for
                    easy access to some of the data that we have. Join us to be
                    part of the data conversation here in Kenya, whether you are
                    a student, employer, business person, and so on.
                </Text>

                <Box>
                    <AvatarGroup max={isTabletAndUp ? 6 : 3}>
                        {profiles.map((profile, index) => (
                            <Avatar
                                key={index}
                                name={profile.name}
                                src={profile.image}
                                size={isTabletAndUp ? 'xl' : 'lg'}
                            />
                        ))}
                    </AvatarGroup>
                </Box>

                <Link href='/team' passHref>
                    <Button
                        color='#fff'
                        fontWeight='400'
                        borderRadius='10px'
                        height={['2.5rem', '2.5rem', '2.5rem', '3rem']}
                        mt='1rem'
                        fontSize='md'
                        bg='brand.primary'
                        _hover={{ bg: 'brand.hover' }}
                        _focus={{ bg: 'brand.hover', outline: 'none' }}
                        _active={{ bg: 'brand.hover', outline: 'none' }}
                        width={['100%', '80%', '60%', '', '30%']}>
                        Meet the team &rarr;
                    </Button>
                </Link>
            </VStack>
        </Box>
    )
}

export default About
