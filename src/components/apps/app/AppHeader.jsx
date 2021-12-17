import { Box, Stack, useColorMode, Heading } from '@chakra-ui/react'
import UserAvatar from '@/src/components/common/UserAvatar'

function AppHeader({ app }) {
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
                height='100%'
                width='100%'
                p={['20px', '20px', '0 30px', '0 60px']}
                direction='column'
                alignItems='flex-start'
                justifyContent='center'
                borderRadius='10px'
                color='#fff'
                spacing='6'>
                <Heading>{app?.title}</Heading>
                <UserAvatar
                    user={{
                        name: app?.author,
                        date: new Date(app?.created).toDateString(),
                    }}
                    onSurface
                />
            </Box>
        </Box>
    )
}

AppHeader.defaultProps = {
    app: {},
}

export default AppHeader
