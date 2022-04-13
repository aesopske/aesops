import Layout from '@/src/components/common/Layout'
import { fetchApps } from '@/src/utils/requests'
import { Box, Grid, GridItem, Text, useColorMode } from '@chakra-ui/react'
import AppsFilter from '@/src/components/apps/AppsFilter'
import AppsList from '@/src/components/apps/AppsList'
import { useDebounce } from 'use-debounce'
import { useState, useEffect } from 'react'
import PageBanner from '@/src/components/common/PageBanner'

function Apps({ apps }) {
    const { colorMode } = useColorMode()
    const [searchTerm, setSearchTerm] = useState('')
    const [filtered, setFiltered] = useState([])

    const [text] = useDebounce(searchTerm, 500)

    const fetchFiltered = async (txt) => {
        const data = await fetchApps({ keyword: txt })
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

    const description =
        'Find applications and demos created by the community and Aesops members that utilize the data we have and bring to life ideas that we share through our stories.'
    return (
        <Layout
            title='Aesops | Apps'
            url='https://aesops.co.ke/apps'
            description={description}>
            <Box width={['95%', '90%', '80%']} height='auto' mx='auto'>
                <PageBanner heading='App Library'>
                    <Text
                        as='p'
                        width={['100%', '100%', '80%', '', '60%', '45%']}
                        color={colorMode === 'light' ? 'gray.100' : 'gray.400'}
                        fontSize='1.1rem'>
                        Using the skills,information, data and datasets that we
                        prepare and share, we also want to understand how real
                        life applications would work with these data. Here we
                        share real apps and proof of concepts that utilize these
                        resources.
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
                        <AppsFilter
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </GridItem>
                    <GridItem colSpan={[1, 1, 1, 2]}>
                        {text ? (
                            <AppsList apps={filtered} />
                        ) : (
                            <AppsList apps={apps} />
                        )}
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    const data = await fetchApps({ limit: 100, page: 1 })

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

        revalidate: 10,
    }
}

Apps.defaultProps = {
    apps: [],
}

export default Apps
