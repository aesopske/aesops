import React from 'react'
import {
    Box,
    Text,
    Heading,
    Stack,
    Button,
    Image,
    useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'

function Offers() {
    const { colorMode } = useColorMode()
    return (
        <Box height='auto' width={['95%', '90%', '80%']} mx='auto'>
            <Box
                height='auto'
                width='100%'
                mx='auto'
                bgImage="url('/images/charts.jpg')"
                position='relative'
                bgAttachment='fixed'
                bgRepeat='no-repeat'
                bgSize='cover'
                p='50px 0'
                borderRadius='20px'
                my='2rem'>
                <Box
                    bgGradient='linear(to-r,#804fadcc, #700dccc0 )'
                    position='absolute'
                    borderRadius='20px'
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
                    width={['90%', '90%', '90%', '90%']}
                    mx='auto'
                    zIndex='10'
                    my={['0', '0', '2rem', '4rem']}>
                    <Box flex='1' color='#fff' zIndex='20'>
                        <Heading size='xl'>Datasets</Heading>
                        <Text
                            as='p'
                            fontSize={['1rem', '1rem', '1.1rem']}
                            my='2rem'
                            width={['100%', '100%', '90%', '100%']}>
                            We look for unique datasets from Kenya, or Africa
                            that are largely under-represented in the data
                            science community. Solutions that work elsewhere may
                            not necessarily work here in Kenya, so we share the
                            datasets to help Kenyans develop their own home
                            grown solutions that fit the unique problems that we
                            face.
                        </Text>
                        <Link href='/datasets' passHref>
                            <Button
                                height='3rem'
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
            <Box
                height='auto'
                width='100%'
                mx='auto'
                p={['20px 0', '20px 0', '30px 0', '100px 0']}>
                <Box
                    as={Stack}
                    height='100%'
                    spacing='8'
                    direction={[
                        'column-reverse',
                        'column-reverse',
                        'column-reverse',
                        'row',
                    ]}
                    alignItems='center'
                    justifyContent='space-between'
                    width={['90%', '90%', '90%', '100%']}
                    mx='auto'
                    my={['0', '0', '2rem', '4rem']}>
                    <Box
                        flex='1'
                        width={['100%', '60%', '40%']}
                        height={['100%', '70%', '60%']}
                        mt={['2rem', '2rem', '2rem', '0']}>
                        <Image
                            bg={colorMode === 'light' ? '#fff' : 'gray.800'}
                            shadow='2xl'
                            p='30px'
                            borderRadius='20px'
                            src='/svg/projects.svg'
                            alt='projects'
                            width={['100%', '100%', '80%']}
                            height='100%'
                            objectFit='contain'
                        />
                    </Box>

                    <Box flex='1'>
                        <Heading size='xl'>Interesting Projects</Heading>
                        <Text
                            as='p'
                            my='2rem'
                            fontSize={['1rem', '1rem', '1.1rem']}
                            color={
                                colorMode === 'light'
                                    ? '#555'
                                    : 'whiteAlpha.800'
                            }
                            width={['100%', '100%', '90%', '100%']}>
                            Well beyond learning and all things technical, our
                            main goal is to be interesting and informative. We
                            therefore try to find information that adds value to
                            our readers, that informs, challenges and develops
                            everyone that reads them with their quality and
                            intensive research.
                        </Text>
                        <Link href='/apps' passHref>
                            <Button
                                height='3rem'
                                width={['100%', '100%', '90%', 'auto']}
                                borderRadius='10px'
                                fontSize='1rem'
                                bg='brand.primary'
                                _hover={{ bg: 'brand.hover' }}
                                _focus={{ bg: 'brand.hover', outline: 'none' }}
                                _active={{ bg: 'brand.hover', outline: 'none' }}
                                color='#fff'
                                fontWeight='500'>
                                View applications &rarr;
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
            <Box
                height='auto'
                width='100%'
                mx='auto'
                p={['50px 0', '50px 0', '100px 0']}
                bgImage="url('/images/project.jpg')"
                bgAttachment='fixed'
                bgSize='cover'
                borderRadius='20px'
                bgRepeat='no-repeat'
                position='relative'
                my='2rem'>
                <Box
                    bgGradient='linear(to-r,#804fadcc, #700dccc0 )'
                    position='absolute'
                    borderRadius='20px'
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
                    width={['90%', '90%', '90%', '90%']}
                    mx='auto'
                    spacing='8'
                    my={['0', '0', '2rem', '4rem']}>
                    <Box flex='1' color='#fff' zIndex='20'>
                        <Heading size='xl'>Visuals and Code</Heading>
                        <Text
                            as='p'
                            my='2rem'
                            fontSize={['1rem', '1rem', '1.1rem']}
                            width={['100%', '100%', '90%', '100%']}>
                            Our eyes are the gateways to our very souls. We
                            appeal to the souls of our readers with beautiful
                            plots made in R, python or tableau that will
                            captivate, inform and mostly delight each and every
                            person that sees them. We then share the code that
                            was used to make the graphs and analysis so that we
                            encourage collaboration, verification and
                            duplication of the work to maintain high
                            professionalism and encourage learning.
                        </Text>
                        <Link href='/apps' passHref>
                            <Button
                                height='3rem'
                                width={['100%', '100%', '90%', 'auto']}
                                borderRadius='10px'
                                fontSize='1rem'
                                bg='#fff'
                                colorScheme='gray'
                                mb={['2rem', '0']}
                                color='#444'
                                fontWeight='500'>
                                View applications &rarr;
                            </Button>
                        </Link>
                    </Box>
                    <Box
                        flex='1'
                        as={Stack}
                        display={['none', 'none', 'flex']}
                        zIndex='20'
                        alignItems='flex-end'
                        width={['100%', '60%', '40%']}
                        height={['100%', '70%', '60%']}>
                        <Image
                            src='/svg/visuals.svg'
                            alt='visuals'
                            width={['', '', '', '80%']}
                            height='100%'
                            objectFit='contain'
                        />
                    </Box>
                </Box>
            </Box>
            <Box
                height={['auto', 'auto', 'auto', '70vh']}
                width='100%'
                mx='auto'
                my='2rem'>
                <Box
                    as={Stack}
                    height='100%'
                    direction={[
                        'column-reverse',
                        'column-reverse',
                        'column-reverse',
                        'row',
                    ]}
                    alignItems='center'
                    justifyContent='space-between'
                    spacing='8'
                    width={['90%', '90%', '90%', '100%']}
                    mx='auto'
                    my='4rem'>
                    <Box
                        flex='1'
                        width={['100%', '60%', '40%']}
                        height={['100%', '70%', '60%']}
                        mt={['2rem', '2rem', '2rem', '0']}>
                        <Image
                            p='30px'
                            borderRadius='20px'
                            shadow='2xl'
                            bg={colorMode === 'light' ? '#fff' : 'gray.800'}
                            src='/svg/ml.svg'
                            alt='machine learning'
                            width={['100%', '100%', '80%']}
                            height='100%'
                            objectFit='contain'
                        />
                    </Box>
                    <Box flex='1'>
                        <Heading size='xl'>Machine Learning</Heading>
                        <Text
                            as='p'
                            my='2rem'
                            fontSize={['1rem', '1rem', '1.1rem']}
                            color={
                                colorMode === 'light'
                                    ? '#555'
                                    : 'whiteAlpha.800'
                            }
                            width={['100%', '100%', '90%', '100%']}>
                            We all want to make future predictions based on the
                            data we have today,while others use astrology, we
                            use data science. Our major focus is to make Kenya
                            the AI hub of Africa through the activities listed
                            above as well as our members&apos; insights and
                            information that they share. We also develop simple
                            demos and applications in machine learning that we
                            build and share.
                        </Text>
                        <Link href='/articles' passHref>
                            <Button
                                height='3rem'
                                width={['100%', '100%', '90%', 'auto']}
                                borderRadius='10px'
                                fontSize='1rem'
                                bg='brand.primary'
                                _hover={{ bg: 'brand.hover' }}
                                _focus={{ bg: 'brand.hover', outline: 'none' }}
                                _active={{ bg: 'brand.hover', outline: 'none' }}
                                color='#fff'
                                fontWeight='500'>
                                View articles &rarr;
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Offers
