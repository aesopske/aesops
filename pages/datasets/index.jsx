import Layout from '@/src/components/common/Layout'
import { fetchDatasets } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import DatasetBanner from '@/src/components/datasets/DatasetBanner'
import DatasetFilter from '@/src/components/datasets/DatasetsFilter'
import DatasetList from '@/src/components/datasets/DatasetsList'

function Datasets({ datasets }) {
    const description =
        'Datasets We look for unique datasets from Kenya, or Africa that are largely under-represented in the data science community. Solutions that work elsewhere may not necessarily work here in Kenya, so we share the datasets to help Kenyans develop their own home grown solutions that fit the unique problems that we face.'
    return (
        <Layout
            title='Aesops - Datasets'
            description={description}
            url='https://aesops.co.ke/datasets'>
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
