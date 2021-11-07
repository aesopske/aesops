import Layout from '@/src/components/common/Layout'
import Teamcard from '@/src/components/team/Teamcard'
import { Box, Heading, Grid, useColorMode } from '@chakra-ui/react'
import { profiles } from '@/src/utils/team'

function Team() {
    const { colorMode } = useColorMode()

    const description =
        'Meet the brilliant minds behind Aesops. Investing and growing a platform and community with data experts to make share data and findings.'

    return (
        <Layout title='Aesops - team' description={description}>
            <Box height='auto' minHeight='50vh' width='80%' mx='auto' p='10px'>
                <Box minHeight='100vh' width='100%'>
                    <Box
                        width='100%'
                        height={['auto', 'auto', 'auto', '50vh', '30vh']}
                        bgImage={
                            colorMode === 'light'
                                ? '/images/background.png'
                                : '/svg/hero-dark.svg'
                        }
                        bgRepeat='no-repeat'
                        p='50px'
                        bgPosition='center'
                        bgAttachment='fixed'
                        position='relative'
                        zIndex='0'
                        mt='2rem'
                        mb='5rem'
                        borderRadius='20px'
                        bgSize='cover'>
                        <Heading my='1rem' size='2xl' width='100%' color='#fff'>
                            Meet The Team
                        </Heading>
                    </Box>

                    <Box
                        width={['90%', '80%', '100%']}
                        margin='1rem auto'
                        padding='10px 0'
                        height='auto'>
                        <Grid
                            gap='3rem'
                            width='100%'
                            mx='auto'
                            templateColumns={[
                                'repeat(1,1fr)',
                                'repeat(1,1fr)',
                                'repeat(2,1fr)',
                                'repeat(3,1fr)',
                            ]}>
                            {profiles.map((profile) => (
                                <Teamcard
                                    key={profile.name}
                                    profile={profile}
                                />
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}

export default Team
