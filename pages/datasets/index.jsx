import { useState, useEffect } from 'react'
import Layout from '@/src/components/common/Layout'
import { fetchDatasets } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import DatasetBanner from '@/src/components/datasets/DatasetBanner'
import DatasetFilter from '@/src/components/datasets/DatasetsFilter'
import DatasetList from '@/src/components/datasets/DatasetsList'
import { useDebounce } from 'use-debounce'

function Datasets({ datasets }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filtered, setFiltered] = useState([])

    const [text] = useDebounce(searchTerm, 500)

    const fetchFiltered = async (txt) => {
        const data = await fetchDatasets(txt)
        if (data.items) {
            setFiltered(data.items)
        } else {
            setFiltered([])
        }
    }

    // client side rendering
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (text) {
                // fetch filtered
                fetchFiltered(text)
            }
        }
    }, [text])
    return (
        <Layout title='Aesops - Datasets'>
            <Box width={['90%', '90%', '80%']} height='auto' mx='auto'>
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
                        <DatasetFilter
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        {text ? (
                            <DatasetList datasets={filtered} />
                        ) : (
                            <DatasetList datasets={datasets} />
                        )}
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps() {
    const data = await fetchDatasets()

    if (!data.items) {
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
