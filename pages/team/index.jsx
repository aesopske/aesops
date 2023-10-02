import Layout from '@/src/components/common/Layout'
import Teamcard from '@/src/components/team/Teamcard'
import { Box, Grid, GridItem, useColorMode, Text } from '@chakra-ui/react'
import { profiles } from '@/src/utils/team'
import PageBanner from '@/src/components/common/PageBanner'

function Team({ cookieConsent }) {
    const { colorMode } = useColorMode()

    const description =
        'Meet the brilliant minds behind Aesops. Investing and growing a platform and community with data experts to make share data and findings.'

    return (
        <Layout
            title='Aesops - team'
            description={description}
            cookieConsent={cookieConsent}>
            <Box
                height='auto'
                minHeight='50vh'
                width={['100%', '100%', '80%']}
                mx='auto'
                p='10px'>
                <Box minHeight='100vh' width='100%'>
                    <PageBanner heading='Meet The Team'>
                        <Text
                            as='p'
                            width={['100%', '100%', '80%', '', '50%', '45%']}
                            color={
                                colorMode === 'light' ? 'gray.100' : 'gray.400'
                            }
                            fontSize='lg'>
                            These are the great minds behind all the activities,
                            all the stories and all the products that makes up
                            Aesops as a whole.
                        </Text>
                    </PageBanner>

                    <Box
                        width='100%'
                        margin='1rem auto'
                        padding='10px 0'
                        height='auto'>
                        <Grid
                            gap='2rem'
                            width='100%'
                            mx='auto'
                            templateColumns={[
                                'repeat(1,1fr)',
                                'repeat(2,1fr)',
                                'repeat(2,1fr)',
                                'repeat(3,1fr)',
                                'repeat(3,1fr)',
                                'repeat(4,1fr)',
                            ]}>
                            {profiles.map((profile) => (
                                <GridItem key={profile.name}>
                                    <Teamcard
                                        key={profile.name}
                                        profile={profile}
                                    />
                                </GridItem>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}

Team.getInitialProps = async (ctx) => {
    const cookieConsent = ctx.req ? ctx.req.cookies.cookieConsent : null
    return {
        cookieConsent,
    }
}

export default Team
