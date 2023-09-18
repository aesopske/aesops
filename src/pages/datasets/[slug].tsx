import Layout from '@/components/common/Layout'
import { fetchDataset, fetchDatasets } from '@/utils/requests'
import { Box, Grid, GridItem, VStack } from '@chakra-ui/react'
import DatasetLinks from '@/components/datasets/dataset/DatasetLinks'
import DatasetDescription from '@/components/datasets/dataset/DatasetDescription'
import PageBanner from '@/components/common/PageBanner'
import UserAvatar from '@/components/common/UserAvatar'
import Share from '@/components/common/ShareBtns'
import { DATASET } from '@/types'

type DatasetDetailProps = {
    dataset: DATASET
}

function DatasetDetail({ dataset }: DatasetDetailProps) {
    return (
        <Layout title={dataset?.title} description={dataset?.description}>
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
                    position='relative'
                    templateColumns={[
                        'repeat(1, 1fr)',
                        'repeat(1, 1fr)',
                        'repeat(2, 1fr)',
                        'repeat(3, 1fr)',
                    ]}>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        <DatasetDescription dataset={dataset} />
                    </GridItem>
                    <GridItem>
                        <VStack
                            position={[
                                'relative',
                                'relative',
                                'relative',
                                'sticky',
                            ]}
                            zIndex='10'
                            top={['0', '0', '0', '6rem']}
                            left='0'>
                            <Share title={dataset?.title} />
                            <DatasetLinks dataset={dataset} />
                        </VStack>
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
        paths: data.items.map((dataset: DATASET) => ({
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
