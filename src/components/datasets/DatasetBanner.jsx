import { Box, useColorMode, Stack, Heading, Text } from '@chakra-ui/react'

function AppsBanner() {
    const { colorMode } = useColorMode()
    return (
        <Box
            height={['auto', 'auto', '35vh', '35vh', '35vh', '30vh']}
            width='100%'
            my='1rem'
            borderRadius='10px'
            bgImage={
                colorMode === 'light'
                    ? 'url(/images/background.png)'
                    : 'url(/svg/hero-dark.svg)'
            }
            bgSize='cover'
            position='relative'
            bgRepeat='no-repeat'>
            <Box
                as={Stack}
                height='100%'
                width='100%'
                p={['20px', '20px', '20px', '0 60px']}
                direction='column'
                alignItems='flex-start'
                justifyContent='center'
                borderRadius='10px'
                color='#fff'
                spacing='6'>
                <Heading>Datasets</Heading>
                <Text
                    as='p'
                    fontSize='1.1rem'
                    width={['100%', '100%', '80%', '', '50%', '45%']}
                    color={colorMode === 'light' ? 'gray.100' : 'gray.400'}>
                    We look for unique datasets from Kenya, or Africa that are
                    largely under-represented in the data science community. We
                    share datasets to help Kenyans develop their own solutions
                    that fit unique problems.
                </Text>
            </Box>
        </Box>
    )
}

export default AppsBanner
