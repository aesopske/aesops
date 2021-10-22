import React from 'react'
import Link from 'next/link'
import {
    Box,
    Heading,
    Text,
    Button,
    Image,
    HStack,
    VStack,
} from '@chakra-ui/react'
import Layout from '@/src/components/common/Layout'

function NotFound() {
    return (
        <Layout title='404 - Not found'>
            <Box
                as={HStack}
                alignItems='center'
                justifyContent='center'
                height='100vh'
                width='100%'>
                <Box as={VStack} spacing='8'>
                    <Image
                        src='/svg/notfound.svg'
                        alt='not found'
                        objectFit='contain'
                        height='50%'
                        width='50%'
                    />

                    <VStack spacing='8'>
                        <Heading size='4xl'>404 Not Found!!</Heading>
                        <Text mb='1rem' fontSize='1.2rem'>
                            Could not find the page you were looking for
                        </Text>

                        <Link href='/' passHref>
                            <Button
                                height='3rem'
                                bg='brand.primary'
                                _hover={{ bg: 'brand.hover' }}
                                _focus={{
                                    bg: 'brand.primary',
                                    outline: 'none',
                                }}
                                _active={{
                                    bg: 'brand.primary',
                                    outline: 'none',
                                }}
                                color='#fff'
                                borderRadius='10px'>
                                Go back home &rarr;
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            </Box>
        </Layout>
    )
}

export default NotFound
