import Layout from '@/src/components/common/Layout'
import { fetchDataset, fetchDatasets } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import DatasetLinks from '@/src/components/datasets/dataset/DatasetLinks'
import DatasetDescription from '@/src/components/datasets/dataset/DatasetDescription'
import PageBanner from '@/src/components/common/PageBanner'
import UserAvatar from '@/src/components/common/UserAvatar'

function DatasetDetail({ dataset, cookieConsent }) {
    return (
        <Layout
            title={dataset?.title}
            description={dataset?.description}
            cookieConsent={cookieConsent}>
            <Box
                width={['90%', '90%', '90%', '80%', '', '75%']}
                mx='auto'
                height='auto'
                minHeight='50vh'>
                <PageBanner heading={dataset?.title}>
                    <UserAvatar
                        user={{
                            name: dataset?.author,
                            date: new Date(dataset?.created).toDateString(),
                        }}
                        size='md'
                        onSurface
                    />
                </PageBanner>
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
                        <DatasetLinks dataset={dataset} />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        <DatasetDescription dataset={dataset} />
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getStaticProps(ctx) {
    const { slug } = ctx.params
    const data = await fetchDataset(slug)

    if (!data) {
        return {
            redirect: {
                destination: '/datasets',
                persistant: false,
            },
        }
    }

    return {
        props: {
            dataset: data.item,
        },
    }
}

export async function getStaticPaths() {
    const data = await fetchDatasets({ limit: 100, page: 1 })

    if (!data.items) {
        return {
            paths: [],
            fallback: true,
        }
    }

    return {
        paths: data.items.map((dataset) => ({
            params: {
                slug: dataset.slug,
            },
        })),
        fallback: 'blocking',
    }
}

DatasetDetail.defaultProps = {
    dataset: {},
}

export default DatasetDetail
