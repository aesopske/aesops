import Layout from '@/src/components/common/Layout'
import ProfileList from '@/src/components/community/ProfileList'
import TopRank from '@/src/components/community/TopRank'
import {
    fetchApps,
    fetchArticles,
    fetchCommunity,
    fetchDatasets,
} from '@/src/utils/requests'
import { Box } from '@chakra-ui/layout'
import Promise from 'promise'

function Community({ profiles, topranked, posts, apps, datasets }) {
    const description =
        'Join our community, share your thoughts about data, share insights on a data, create apps, share datasets of your own and share articles with the rest of the community.'

    const details = {
        posts,
        apps,
        datasets,
    }

    return (
        <Layout
            title='Aesops - Community'
            description={description}
            url='https://aesops.co.ke/community'>
            <Box width={['95%', '90%', '90%', '80%']} mx='auto'>
                <TopRank profiles={topranked} details={details} />
                <ProfileList profiles={profiles} details={details} />
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    // const data = await fetchCommunity()
    // const postData = await fetchArticles()
    // const appData = await fetchApps()
    // const datasetData = await fetchDatasets()

    const [data, postData, appData, datasetData] = await Promise.all([
        fetchCommunity(),
        fetchArticles(),
        fetchApps(),
        fetchDatasets(),
    ])

    if (!data.items) {
        return {
            redirect: {
                destination: '/',
                persistent: false,
            },
        }
    }

    const posts = postData.items
    const apps = appData.items
    const datasets = datasetData.items

    const topProfiles = data.items && data.items.slice(0, 3)
    const profiles = data.items && data.items.slice(3, data.items.length)

    return {
        props: {
            topranked: topProfiles,
            profiles,
            posts,
            apps,
            datasets,
        },
        revalidate: 10,
    }
}

Community.defaultProps = {
    profiles: [],
    topranked: [],
    posts: [],
    datasets: [],
    apps: [],
}

export default Community
