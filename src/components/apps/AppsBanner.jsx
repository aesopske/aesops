import { Box, useColorMode, Stack, Heading, Text } from '@chakra-ui/react'

function AppsBanner() {
    const { colorMode } = useColorMode()
    return (
        <Box
            height={['auto', 'auto', '30vh']}
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
                <Heading>Applications</Heading>
                <Text
                    as='p'
                    width={['100%', '100%', '80%', '45%']}
                    color={colorMode === 'light' ? 'gray.100' : 'gray.400'}
                    fontSize='1.2rem'>
                    Using the skills,information, data and datasets that we
                    prepare and share, we also want to understand how real life
                    applications would work with these data. Here we share real
                    apps and proof of concepts that utilize these resources.
                </Text>
            </Box>
        </Box>
    )
}

export default AppsBanner
