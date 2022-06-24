import { useState, useEffect } from 'react'
import Layout from '@/src/components/common/Layout'
import { fetchDatasets } from '@/src/utils/requests'
import { Box, Grid, GridItem, Text, useColorMode } from '@chakra-ui/react'
import DatasetFilter from '@/src/components/datasets/DatasetsFilter'
import DatasetList from '@/src/components/datasets/DatasetsList'
import { useDebounce } from 'use-debounce'
import PageBanner from '@/src/components/common/PageBanner'

function Datasets({ datasets }) {
    const { colorMode } = useColorMode()
    const [searchTerm, setSearchTerm] = useState('')
    const [filtered, setFiltered] = useState([])

    const [text] = useDebounce(searchTerm, 500)

    const fetchFiltered = async (txt) => {
        const data = await fetchDatasets({ keyword: txt })
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
            <Box
                width={['90%', '90%', '80%', '', '75%']}
                height='auto'
                mx='auto'>
                <PageBanner heading='Datasets'>
                    <Text
                        as='p'
                        fontSize='lg'
                        width={['100%', '100%', '80%', '', '60%', '45%']}
                        color={colorMode === 'light' ? 'gray.100' : 'gray.400'}>
                        We look for unique datasets from Kenya, or Africa that
                        are largely under-represented in the data science
                        community. We share datasets to help Kenyans develop
                        their own solutions that fit unique problems.
                    </Text>
                </PageBanner>
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

export async function getStaticProps() {
    const data = await fetchDatasets({ limit: 100, page: 1 })

    if (!data.items) {
        return {
            props: {
                datasets: [],
            },
        }
    }

    return {
        props: {
            datasets: data.items,
        },

        revalidate: 60 * (60 * 2),
    }
}

Datasets.defaultProps = {
    datasets: [],
}

export default Datasets
