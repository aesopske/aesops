import Layout from '@/src/components/common/Layout'
import { fetchApps } from '@/src/utils/requests'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import AppsBanner from '@/src/components/apps/AppsBanner'
import AppsFilter from '@/src/components/apps/AppsFilter'
import AppsList from '@/src/components/apps/AppsList'
import { useDebounce } from 'use-debounce'
import { useState, useEffect } from 'react'

function Apps({ apps }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filtered, setFiltered] = useState([])

    const [text] = useDebounce(searchTerm, 500)

    const fetchFiltered = async (txt) => {
        const data = await fetchApps(txt)
        if (data.items) {
            setFiltered(data.items)
        } else {
            setFiltered([])
        }
    }

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
