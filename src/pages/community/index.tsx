import Promise from 'promise'
import { Box } from '@chakra-ui/react'

import Layout from '@/components/common/Layout'
import TopRank from '@/components/community/TopRank'
import { APP, ARTICLE, DATASET, USER } from '@/types'
import {
    fetchApps,
    fetchArticles,
    fetchCommunity,
    fetchDatasets,
} from '@/utils/requests'
import ProfileList from '@/components/community/ProfileList'

type CommunityProps = {
    apps: APP[]
    profiles: USER[]
    topranked: USER[]
    posts: ARTICLE[]
    datasets: DATASET[]
}

function Community({
    profiles,
    topranked,
    posts,
    apps,
    datasets,
}: CommunityProps) {
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

export async function getServerSideProps() {
    const [data, postData, appData, datasetData] = await Promise.all([
        fetchCommunity(),
        fetchArticles(),
        fetchApps(),
        fetchDatasets(),
    ])

    const posts = postData.items
    const apps = appData.items
    const datasets = datasetData.items

    const topProfiles = data.items && data.items.slice(0, 3)
    const profiles = data.items && data.items.slice(3, data.items.length)

    return {
        props: {
            topranked: topProfiles || [],
            profiles: profiles || [],
            posts: posts || [],
            apps: apps || [],
            datasets: datasets || [],
        },
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
