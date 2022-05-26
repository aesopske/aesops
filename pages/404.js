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

function NotFound({ cookieConsent }) {
    return (
        <Layout title='404 - Not found' cookieConsent={cookieConsent}>
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
                        height='30%'
                        width='20%'
                    />

                    <VStack spacing='4'>
                        <Heading size='3xl'>404 Not Found!!</Heading>
                        <Text fontSize='lg'>
                            Could not find the page you were looking for
                        </Text>

                        <Link href='/' passHref>
                            <Button
                                height='2.5rem'
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

export async function getStaticProps(ctx) {
    const cookieConsent = ctx.req ? ctx.req.cookies.cookieConsent : null
    return {
        props: {
            cookieConsent,
        },
    }
}

export default NotFound
