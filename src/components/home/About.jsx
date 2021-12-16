import React from 'react'
import {
    Button,
    Text,
    Box,
    Heading,
    Image,
    Stack,
    useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'

function About() {
    const { colorMode } = useColorMode()
    return (
        <Box
            width={['90%', '90%', '100%']}
            mx='auto'
            height='auto'
            p='50px 0'
            my='5rem'>
            <Box
                as={Stack}
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
                <Box
                    width={['80%', '60%', '40%', '30%']}
                    height={['80%', '70%', '60%', '40%']}
                    flex='1'
                    mt={['2rem', '2rem', '2rem', '0']}>
                    <Image
                        shadow='2xl'
                        p='30px'
                        bg={colorMode === 'light' ? '#fff' : 'gray.800'}
                        borderRadius='20px'
                        src={
                            colorMode === 'light'
                                ? '/svg/about-image.png'
                                : '/svg/about-image-dark.png'
                        }
                        alt='about'
                        width='90%'
                        height='80%'
                        objectFit='contain'
                    />
                </Box>
                <Box flex='1' width={['100%', '100%', '80%', '60%']} ml='1rem'>
                    <Heading size='xl'>Who are we?</Heading>
                    <Text
                        width='100%'
                        as='p'
                        my='1.5rem'
                        fontSize={['1rem', '1rem', '1.1rem']}
                        color={colorMode === 'light' ? '#555' : '#f4f4f4'}>
                        We are a Kenyan data organization with the dream of
                        revolutionizing the Kenyan data sector. The dream
                        started in 2018, but officially in 2020 we created a
                        website for the public and have been adding new users
                        and partners since. We collect data, curate it, and
                        share it with our users to encourage them to use it in
                        creating data applications, analysis, or for their
                        general information.
                    </Text>
                    <Text
                        width='100%'
                        as='p'
                        my='1.5rem'
                        fontSize={['1rem', '1rem', '1.1rem']}
                        color={colorMode === 'light' ? '#555' : '#f4f4f4'}>
                        We also share data-driven articles where we analyze the
                        state of the art technologies in Kenya and in the region
                        with the aim of creating a silicon savanna right here in
                        Kenya. We also display datasets using lovely dashboards
                        for easy access to some of the data that we have. Join
                        us to be part of the data conversation here in Kenya,
                        whether you are a student, employer, business person,
                        and so on.
                    </Text>

                    <Link href='/team' passHref>
                        <Button
                            color='#fff'
                            fontWeight='400'
                            borderRadius='10px'
                            height='3rem'
                            mt='1rem'
                            bg='brand.primary'
                            _hover={{ bg: 'brand.hover' }}
                            _focus={{ bg: 'brand.hover', outline: 'none' }}
                            _active={{ bg: 'brand.hover', outline: 'none' }}
                            fontSize='1rem'
                            width={['100%', '80%', '60%', '', '30%']}>
                            Meet the team &rarr;
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}

export default About
