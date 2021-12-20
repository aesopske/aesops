import { Box, Heading } from '@chakra-ui/react'
import ArticleList from '@/src/components/Articles/ArticleList'
import FeaturedList from '@/src/components/Articles/FeaturedList'
import Layout from '@/src/components/common/Layout'
import { fetchArticles } from '@/src/utils/requests'

function Articles({ articles, featured, count }) {
    const description =
        'Share your stories about data, insights from our datasets and those shared by the community.'
    return (
        <Layout
            title='Aesops - Articles'
            url='https://aesops.co.ke/articles'
            description={description}>
            <Box
                mt={['0', '0', '0', '2rem', '2rem']}
                width={['95%', '90%', '80%']}
                minHeight='50vh'
                mx='auto'>
                <Heading size='lg' my='2rem'>
                    Editor&apos;s Choice
                </Heading>
                <FeaturedList featured={featured} />
                <ArticleList articles={articles} count={count} />
            </Box>
        </Layout>
    )
}

export async function getServerSideProps() {
    // generate our rss feed
    const data = await fetchArticles()

    const featuredArticles =
        data.items && data.items.filter((item) => item.featured).splice(0, 4)

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
            featured: featuredArticles,
            articles: data.items,
            count: data.count,
        },
    }
}

Articles.defaultProps = {
    articles: [],
    featured: [],
    count: 0,
}

export default Articles
