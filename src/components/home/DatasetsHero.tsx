import React from 'react'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AesopBtn from '../common/atoms/AesopBtn'
import AesopImage from '../common/AesopImage'
import useDimensions from 'react-cool-dimensions'

function DatasetsHero() {
    const { observe, width, height } = useDimensions()
    return (
        <Box
            height='auto'
            width='100%'
            mx='auto'
            bgImage="url('/images/charts.jpg')"
            position='relative'
            bgAttachment='fixed'
            bgRepeat='no-repeat'
            bgSize='cover'
            p={['50px 20px', '50px 0', '50px 0']}
            borderRadius='0'
            my='2rem'>
            <Box
                bgGradient='linear(to-b, #804fadcc, #700dccc0 )'
                position='absolute'
                borderRadius='0'
                top='0'
                left='0'
                zIndex='0'
                width='100%'
                height='100%'
                backdropFilter='blur(5px)'
            />
            <Stack
                height='100%'
                direction={['column', 'column', 'column', 'row']}
                alignItems='center'
                justifyContent='space-between'
                width={['100%', '90%', '80%', '', '75%']}
                mx='auto'
                zIndex='10'
                my={['0', '0', '2rem', '4rem']}>
                <Box
                    as={motion.div}
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.3, delay: 0.3 },
                    }}
                    flex='1'
                    color='#fff'
                    zIndex='20'>
                    <Heading fontSize={['2xl', '', '', '', '3xl', '4xl']}>
                        Datasets
                    </Heading>
                    <Text
                        as='p'
                        my='2rem'
                        fontSize='xl'
                        width={['100%', '100%', '90%', '100%']}>
                        We look for unique datasets from Kenya, or Africa that
                        are largely under-represented in the data science
                        community. Solutions that work elsewhere may not
                        necessarily work here in Kenya, so we share the datasets
                        to help Kenyans develop their own home grown solutions
                        that fit the unique problems that we face.
                    </Text>
                    <Link href='/datasets' passHref>
                        <AesopBtn
                            label='View datasets &rarr;'
                            bg='white'
                            color='gray.600'
                            minWidth={['100%', '100%', '90%', '40%']}
                            _hover={{ bg: 'gray.100' }}
                            _focus={{ bg: 'gray.100' }}
                            _active={{ bg: 'gray.100' }}
                        />
                    </Link>
                </Box>
                <Box
                    ref={observe}
                    as={motion.div}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.3, delay: 0.3 },
                    }}
                    flex='1'
                    zIndex='20'
                    width='100%'
                    height={['35vh', '40vh', '', '45vh']}
                    display={['none', 'none', 'block']}
                    mt={['2rem', '2rem', '2rem', '0']}>
                    <AesopImage
                        src='/svg/dataset.svg'
                        alt='Datasets'
                        width={width || 600}
                        height={height || 600}
                        objectFit='contain'
                        layout='responsive'
                    />
                </Box>
            </Stack>
        </Box>
    )
}

export default DatasetsHero
