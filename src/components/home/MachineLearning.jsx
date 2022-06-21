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

function MachineLearning() {
    const { colorMode } = useColorMode()
    return (
        <Box
            height={['auto', 'auto', 'auto', '70vh']}
            width={['100%', '90%', '80%']}
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
                    <Heading fontSize='2xl'>Machine Learning</Heading>
                    <Text
                        as='p'
                        my='2rem'
                        fontSize={['1rem', '1rem', '', '', '', '1.1rem']}
                        color={
                            colorMode === 'light' ? '#555' : 'whiteAlpha.800'
                        }
                        width={['100%', '100%', '90%', '100%']}>
                        We all want to make future predictions based on the data
                        we have today,while others use astrology, we use data
                        science. Our major focus is to make Kenya the AI hub of
                        Africa through the activities listed above as well as
                        our members&apos; insights and information that they
                        share. We also develop simple demos and applications in
                        machine learning that we build and share.
                    </Text>
                    <Link href='/articles' passHref>
                        <Button
                            height='2.5rem'
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
    )
}

export default MachineLearning
