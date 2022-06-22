import React from 'react'
import { Box, Image, Heading, Text, Stack, Button } from '@chakra-ui/react'
import Link from 'next/link'

function DatasetsHero() {
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
                bgGradient='linear(to-r,#804fadcc, #700dccc0 )'
                position='absolute'
                borderRadius='0'
                top='0'
                left='0'
                zIndex='0'
                width='100%'
                height='100%'
            />
            <Box
                as={Stack}
                height='100%'
                direction={['column', 'column', 'column', 'row']}
                alignItems='center'
                justifyContent='space-between'
                width={['100%', '90%', '80%', '', '75%']}
                mx='auto'
                zIndex='10'
                my={['0', '0', '2rem', '4rem']}>
                <Box flex='1' color='#fff' zIndex='20'>
                    <Heading fontSize={['2xl', '', '', '', '3xl', '4xl']}>
                        Datasets
                    </Heading>
                    <Text
                        as='p'
                        fontSize={['lg', '', '', '', '', 'xl']}
                        my='2rem'
                        width={['100%', '100%', '90%', '100%']}>
                        We look for unique datasets from Kenya, or Africa that
                        are largely under-represented in the data science
                        community. Solutions that work elsewhere may not
                        necessarily work here in Kenya, so we share the datasets
                        to help Kenyans develop their own home grown solutions
                        that fit the unique problems that we face.
                    </Text>
                    <Link href='/datasets' passHref>
                        <Button
                            height={['2.5rem', '2.5rem', '2.5rem', '3rem']}
                            width={['100%', '100%', '90%', 'auto']}
                            borderRadius='10px'
                            fontSize='1rem'
                            color='#444'
                            bg='gray.100'
                            _hover={{ bg: 'gray.100' }}
                            _focus={{ bg: 'gray.100' }}
                            _active={{ bg: 'gray.100' }}
                            fontWeight='500'>
                            View datasets &rarr;
                        </Button>
                    </Link>
                </Box>
                <Box
                    flex='1'
                    zIndex='20'
                    width={['80%', '60%', '40%']}
                    height={['80%', '70%', '60%']}
                    display={['none', 'none', 'block']}
                    mt={['2rem', '2rem', '2rem', '0']}>
                    <Image
                        src='/svg/dataset.svg'
                        alt='Datasets'
                        width='80%'
                        height='80%'
                        objectFit='contain'
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default DatasetsHero
