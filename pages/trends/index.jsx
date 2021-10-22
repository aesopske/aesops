import { Box, Heading, HStack } from '@chakra-ui/react'
import Layout from '@/src/components/common/Layout'

function Trends() {
    return (
        <Layout title='Aesops - Trends'>
            <Box
                width='80%'
                mx='auto'
                minHeight='40vh'
                p='50px'
                as={HStack}
                alignItems='center'
                justifyContent='center'>
                <Heading size='3xl'>Coming Soon</Heading>
            </Box>
        </Layout>
    )
}

export default Trends
