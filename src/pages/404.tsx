import React from 'react'
import Link from 'next/link'
import { Box, Heading, Text, Image, HStack, VStack } from '@chakra-ui/react'
import Layout from '@/components/common/Layout'
import AesopBtn from '@/components/common/atoms/AesopBtn'

function NotFound({ cookieConsent }) {
    return (
        <Layout title='404 - Not found' cookieConsent={cookieConsent}>
            <Box
                as={HStack}
                alignItems='center'
                justifyContent='center'
                minHeight='55vh'
                width='100%'>
                <Box as={VStack} spacing='8'>
                    <Image
                        src='/svg/notfound.svg'
                        alt='not found'
                        objectFit='contain'
                        height='40%'
                        width='30%'
                    />

                    <VStack spacing='4'>
                        <Heading size='3xl'>404 Not Found!!</Heading>
                        <Text fontSize='lg'>
                            Could not find the page you were looking for
                        </Text>

                        <Link href='/' passHref>
                            <AesopBtn label='&larr; Go back home' />
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
