import Layout from '@/src/components/common/Layout'
import { fetchDataset } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import DatasetHeader from '@/src/components/datasets/dataset/DatasetHeader'
import DatasetLinks from '@/src/components/datasets/dataset/DatasetLinks'
import DatasetDescription from '@/src/components/datasets/dataset/DatasetDescription'

function DatasetDetail({ dataset }) {
    return (
        <Layout title={dataset?.title} description={dataset?.description}>
            <Box
                width={['95%', '90%', '90%', '80%']}
                mx='auto'
                height='auto'
                minHeight='50vh'>
                <DatasetHeader dataset={dataset} />
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

export async function getServerSideProps(ctx) {
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

DatasetDetail.defaultProps = {
    dataset: {},
}

export default DatasetDetail
