import Layout from '@/src/components/common/Layout'
import ProfileList from '@/src/components/community/ProfileList'
import TopRank from '@/src/components/community/TopRank'
import { fetchCommunity } from '@/src/utils/requests'
import { Box } from '@chakra-ui/layout'

function Community({ profiles, topranked }) {
    return (
        <Layout title='Aesops - Community'>
            <Box width='80%' mx='auto'>
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
