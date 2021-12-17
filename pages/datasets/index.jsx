import Layout from '@/src/components/common/Layout'
import { fetchDatasets } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import DatasetBanner from '@/src/components/datasets/DatasetBanner'
import DatasetFilter from '@/src/components/datasets/DatasetsFilter'
import DatasetList from '@/src/components/datasets/DatasetsList'

function Datasets({ datasets }) {
    return (
        <Layout title='Aesops - Datasets'>
            <Box width={['95%', '90%', '80%']} height='auto' mx='auto'>
                <DatasetBanner />
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
                        <DatasetFilter />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        <DatasetList datasets={datasets} />
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps() {
    const data = await fetchDatasets()

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
            datasets: data.items,
        },
    }
}

Datasets.defaultProps = {
    datasets: [],
}

export default Datasets
