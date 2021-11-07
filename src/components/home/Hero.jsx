import React from 'react'
import Link from 'next/link'
import Fade from 'react-reveal/Fade'
import {
    Box,
    Image,
    Text,
    Heading,
    Stack,
    Button,
    useColorMode,
} from '@chakra-ui/react'

function Hero() {
    const { colorMode } = useColorMode()
    return (
        <Box
            width={['90%', '90%', '80%']}
            height={['auto', 'auto', 'auto', '100vh', '70vh']}
            bgImage={
                colorMode === 'light'
                    ? '/images/background.png'
                    : '/svg/hero-dark.svg'
            }
            bgRepeat='no-repeat'
            p='10px'
            mx='auto'
            borderRadius='20px'
            my='1rem'
            bgPosition='center'
            bgSize='cover'>
            <Box
                width='100%'
                mx='auto'
                my='1rem'
                p={['20px', '20px', '50px']}
                height='100%'
                as={Stack}
                direction={['column', 'column', 'column', 'row']}
                alignItems='center'
                justifyContent='space-between'>
                <Box>
                    <Fade bottom>
                        <Box width={['100%', '100%', '100%', '100%']}>
                            <Heading as='h1' size='2xl' color='#fff'>
                                We tell stories with data as our medium
                            </Heading>
                            <Text
                                as='p'
                                fontSize={[
                                    '1.1rem',
                                    '1.2rem',
                                    '1.2rem',
                                    '1.2rem',
                                ]}
                                my='2rem'
                                color='#fff'>
                                Understand better what is happening around you
                                both interestingly and qualitatively.
                            </Text>

                            <Box
                                as={Stack}
                                direction={['column', 'column', 'row', 'row']}
                                alignItems={[
                                    'flex-start',
                                    'flex-start',
                                    'center',
                                    'center',
                                ]}>
                                <Button
                                    as='a'
                                    href={`${process.env.DASHBOARD_URL}/signup`}
                                    target='_blank'
                                    rel='noopener noreferer'
                                    bg={
                                        colorMode === 'light'
                                            ? '#fff'
                                            : 'brand.primary'
                                    }
                                    _hover={{
                                        bg:
                                            colorMode === 'light'
                                                ? 'gray.50'
                                                : 'brand.hover',
                                    }}
                                    mr='1rem'
                                    my={['1rem', '1rem', '1rem', '0']}
                                    height='3rem'
                                    width={['100%', '100%', 'auto']}
                                    borderRadius='10px'
                                    fontWeight='500'
                                    fontSize='1rem'>
                                    Join the community &rarr;
                                </Button>
                                <Link href='/articles' passHref>
                                    <Button
                                        bg='transparent'
                                        color='#fff'
                                        border='2px solid'
                                        borderColor={
                                            colorMode === 'light'
                                                ? '#fff'
                                                : 'gray.500'
                                        }
                                        _hover={{ bg: 'transparent' }}
                                        _focus={{
                                            bg: 'transparent',
                                            outline: 'none',
                                        }}
                                        _active={{
                                            bg: 'transparent',
                                            outline: 'none',
                                        }}
                                        mr='1rem'
                                        my={['1rem', '1rem', '1rem', '0']}
                                        height='3rem'
                                        width={['100%', '100%', 'auto', 'auto']}
                                        borderRadius='10px'
                                        fontWeight='500'
                                        fontSize='1rem'>
                                        View articles &rarr;
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </Fade>
                </Box>

                <Fade bottom>
                    <Box my={['2rem', '1rem', '1rem', '0']}>
                        <Image
                            src='/images/aesops-nutshell.png'
                            alt='aesops'
                            width={['100%', '90%', '90%', '80%', '70%']}
                            mx='auto'
                            height='100%'
                            objectFit='contain'
                        />
                    </Box>
                </Fade>
            </Box>
        </Box>
    )
}

export default Hero
