import React from 'react'
import Link from 'next/link'
import { Box, Text, Heading, Stack, useColorMode } from '@chakra-ui/react'
import { useGa } from '@/context/TrackingProvider'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorHandler from '../common/ErrorHandler'
import { motion } from 'framer-motion'
import AesopBtn from '../common/atoms/AesopBtn'
import AesopImage from '../common/AesopImage'
import useDimensions from 'react-cool-dimensions'

function Hero() {
    const { colorMode } = useColorMode()
    const { gaEvent } = useGa()
    const { observe, width, height } = useDimensions()

    return (
        <ErrorBoundary FallbackComponent={ErrorHandler}>
            <Box
                width='100%'
                height={['auto', 'auto', 'auto', '100vh', '70vh']}
                bgImage={
                    colorMode === 'light'
                        ? '/images/background.png'
                        : '/svg/hero-dark.svg'
                }
                bgRepeat='no-repeat'
                p='10px'
                mx='auto'
                borderRadius='0'
                bgPosition='center'
                bgSize='cover'>
                <Box
                    width={['100%', '90%', '80%', '', '75%']}
                    mx='auto'
                    my='1rem'
                    p={['20px 0', '20px 0', '50px 0']}
                    height='100%'
                    as={Stack}
                    direction={['column', 'column', 'column', 'row']}
                    alignItems='center'
                    justifyContent='space-between'>
                    <Box
                        as={motion.div}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            transition: { duration: 0.5, delay: 0.3 },
                        }}>
                        <Box width={['100%', '100%', '100%', '80%']}>
                            <Heading as='h1' size='4xl' color='#fff'>
                                We tell stories with data as our medium
                            </Heading>
                            <Text
                                as='p'
                                fontSize={['lg', '', '', '', '', 'xl']}
                                my='2rem'
                                color='#fff'>
                                Understand better what is happening around you
                                both interestingly and qualitatively.
                            </Text>

                            <Stack
                                direction={['column', 'column', 'row', 'row']}
                                alignItems={[
                                    'flex-start',
                                    'flex-start',
                                    'center',
                                    'center',
                                ]}>
                                <AesopBtn
                                    label='Join the community &rarr;'
                                    isLink
                                    href={`${process.env.DASHBOARD_URL}/auth/signup`}
                                    target='_blank'
                                    onClick={() => {
                                        gaEvent({
                                            category: 'Home',
                                            action: 'Clicked sign up',
                                            label: 'signup',
                                        })
                                    }}
                                    rel='noopener noreferer'
                                    bg={
                                        colorMode === 'light'
                                            ? 'white'
                                            : 'brand.200'
                                    }
                                    _hover={{
                                        bg:
                                            colorMode === 'light'
                                                ? 'gray.100'
                                                : 'brand.300',
                                    }}
                                    color='gray.800'
                                    my={['1rem', '1rem', '1rem', '0']}
                                    minWidth={['100%', '100%', 'auto']}
                                />
                                <Link href='/articles' passHref>
                                    <AesopBtn
                                        label='Explore Articles &rarr;'
                                        variant='outline'
                                        color='white'
                                        onClick={() => {
                                            gaEvent({
                                                category: 'Home',
                                                action: 'Clicked Explore articles',
                                                label: 'Explore articles',
                                            })
                                        }}
                                        _hover={{
                                            bg: 'whiteAlpha.300',
                                        }}
                                        minWidth={['100%', '100%', 'auto']}
                                    />
                                </Link>
                            </Stack>
                        </Box>
                    </Box>

                    <Box
                        ref={observe}
                        as={motion.div}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            transition: { duration: 0.3, delay: 0.3 },
                        }}
                        my={['2rem', '1rem', '1rem', '0']}
                        width={['100%', '90%', '90%', '80%', '70%']}
                        height='100%'
                        display={['none', 'none', 'block']}>
                        <AesopImage
                            mx='auto'
                            alt='aesops'
                            width={width || 600}
                            height={height || 600}
                            objectFit='contain'
                            src='/images/aesops-nutshell.png'
                            priority={true}
                        />
                    </Box>
                </Box>
            </Box>
        </ErrorBoundary>
    )
}

export default Hero
