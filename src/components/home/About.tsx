import React from 'react'
import {
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
import { profiles } from '@/utils/team'
import { motion } from 'framer-motion'
import AesopBtn from '../common/atoms/AesopBtn'

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
                as={motion.div}
                initial={{ y: 100, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.2, delay: 0.1 },
                }}
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
                    fontSize={['lg', 'lg', 'lg', 'xl']}
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
                    fontSize={['lg', 'lg', 'lg', 'xl']}
                    color={colorMode === 'light' ? '#555' : '#f4f4f4'}>
                    We also share data-driven articles where we analyze the
                    state of the art technologies in Kenya and in the region
                    with the aim of creating a silicon savanna right here in
                    Kenya. We also display datasets using lovely dashboards for
                    easy access to some of the data that we have. Join us to be
                    part of the data conversation here in Kenya, whether you are
                    a student, employer, business person, and so on.
                </Text>

                <Box
                    as={motion.div}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.5, delay: 0.4 },
                    }}>
                    <AvatarGroup max={isTabletAndUp ? 6 : 3}>
                        {profiles.map((profile, index) => (
                            <Avatar
                                fontFamily='Roboto'
                                key={index}
                                name={profile.name}
                                src={profile.image}
                                size={isTabletAndUp ? 'xl' : 'lg'}
                            />
                        ))}
                    </AvatarGroup>
                </Box>

                <Box
                    as={motion.div}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.5, delay: 0.6 },
                    }}
                    width={['100%', '80%', '60%', '', '30%']}>
                    <Link href='/team' passHref>
                        <AesopBtn
                            label='Meet the team &rarr;'
                            minWidth='100%'
                        />
                    </Link>
                </Box>
            </VStack>
        </Box>
    )
}

export default About
