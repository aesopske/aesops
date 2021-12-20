import Layout from '@/src/components/common/Layout'
import ProfileList from '@/src/components/community/ProfileList'
import TopRank from '@/src/components/community/TopRank'
import { fetchCommunity } from '@/src/utils/requests'
import { Box } from '@chakra-ui/layout'

function Community({ profiles, topranked }) {
    const description =
        'Join our community, share your thoughts about data, share insights on a data, create apps, share datasets of your own and share articles with the rest of the community.'
    return (
        <Layout
            title='Aesops - Community'
            description={description}
            url='https://aesops.co.ke/community'>
            <Box width={['95%', '90%', '90%', '80%']} mx='auto'>
                <TopRank profiles={topranked} />
                <ProfileList profiles={profiles} />
            </Box>
        </Layout>
    )
}

export async function getServerSideProps() {
    const data = await fetchCommunity()

    if (!data.items) {
        return {
            redirect: {
                destination: '/',
                persistent: false,
            },
        }
    }

    const topProfiles = data.items && data.items.slice(0, 3)
    const profiles = data.items && data.items.slice(3, data.items.length)

    return {
        props: {
            topranked: topProfiles,
            profiles,
        },
    }
}

Community.defaultProps = {
    profiles: [],
    topranked: [],
}

export default Community
