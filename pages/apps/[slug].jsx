import Layout from '@/src/components/common/Layout'
import { fetchApp } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import AppHeader from '@/src/components/apps/app/AppHeader'
import AppLinks from '@/src/components/apps/app/AppLinks'
import AppDescription from '@/src/components/apps/app/AppDescription'

function AppDetail({ app }) {
    return (
        <Layout title={app.title} description={app?.description}>
            <Box
                width={['95%', '90%', '90%', '80%']}
                mx='auto'
                height='auto'
                minHeight='50vh'>
                <AppHeader app={app} />
                <Grid
                    my='2rem'
                    gap='2rem'
                    templateColumns={[
                        'repeat(1, 1fr)',
                        'repeat(1, 1fr)',
                        'repeat(2, 1fr)',
                        'repeat(3, 1fr)',
                    ]}>
                    <GridItem colSpan='1'>
                        <AppLinks app={app} />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        <AppDescription app={app} />
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps(ctx) {
    const { slug } = ctx.params
    const data = await fetchApp(slug)

    if (!data) {
        return {
            redirect: {
                destination: '/',
                persistant: false,
            },
        }
    }

    return {
        props: {
            app: data.item,
        },
    }
}

AppDetail.defaultProps = {
    app: {},
}

export default AppDetail
