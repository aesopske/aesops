import { Box, useColorMode, Stack, Heading, Text } from '@chakra-ui/react'

function PageBanner({ heading, children }) {
    const { colorMode } = useColorMode()
    return (
        <Box
            height={['auto', 'auto', 'auto', '40vh', '30vh']}
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
                p={['20px', '20px', '20px', '20px 60px']}
                direction='column'
                alignItems='flex-start'
                justifyContent='center'
                borderRadius='10px'
                color='#fff'
                spacing='3'>
                <Heading>{heading}</Heading>
                <Box width='100%' height='auto'>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}

PageBanner.defaultProps = {
    heading: 'Banner Title',
    children: (
        <Text as='p'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            totam dicta beatae natus voluptas ea veniam aut. Tempora odit eius
            quis ab mollitia nisi nesciunt, perspiciatis iste similique eos
            dolor!
        </Text>
    ),
}

export default PageBanner
