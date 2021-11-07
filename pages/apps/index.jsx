import Layout from '@/src/components/common/Layout'
import { fetchApps } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import AppsBanner from '@/src/components/apps/AppsBanner'
import AppsFilter from '@/src/components/apps/AppsFilter'
import AppsList from '@/src/components/apps/AppsList'

function Apps({ apps }) {
    return (
        <Layout title='Aesops | Apps'>
            <Box width={['90%', '90%', '80%']} height='auto' mx='auto'>
                <AppsBanner />

                <Grid
                    gap='2rem'
                    templateColumns={[
                        'repeat(1,1fr)',
                        'repeat(1,1fr)',
                        'repeat(1,1fr)',
                        'repeat(3,1fr)',
                    ]}
                    my='2rem'>
                    <GridItem colSpan='1'>
                        <AppsFilter />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        <AppsList apps={apps} />
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps() {
    const data = await fetchApps()

    if (!data) {
        return {
            redirect: {
                destination: '/',
                persistent: false,
            },
        }
    }

    return {
        props: {
            apps: data.items,
        },
    }
}

Apps.defaultProps = {
    apps: [],
}

export default Apps
