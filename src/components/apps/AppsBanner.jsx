import { Box, useColorMode, Stack, Heading, Text } from '@chakra-ui/react'

function AppsBanner() {
    const { colorMode } = useColorMode()
    return (
        <Box
            height='30vh'
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
                position='absolute'
                height='100%'
                width='100%'
                top='0'
                left='0'
                p='0 60px'
                direction='column'
                alignItems='flex-start'
                justifyContent='center'
                borderRadius='10px'
                spacing='6'
                bgGradient={
                    colorMode === 'light'
                        ? 'linear-gradient(to-r, #fff, #fff0 )'
                        : 'none'
                }>
                <Heading>Applications</Heading>
                <Text as='p' width='40%'>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Aliquid quas eligendi dolores numquam sit molestiae itaque
                    blanditiis voluptate nisi eius.
                </Text>
            </Box>
        </Box>
    )
}

export default AppsBanner
