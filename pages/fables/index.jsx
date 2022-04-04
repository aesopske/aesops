import { Box } from '@chakra-ui/react'
import ArticleList from '@/src/components/Articles/ArticleList'
import FeaturedList from '@/src/components/Articles/FeaturedList'
import Layout from '@/src/components/common/Layout'
import { fetchArticles, fetchFeaturedArticles } from '@/src/utils/requests'
import Promise from 'promise'

function Articles({ articles, featured, count }) {
    return (
        <Layout title='Aesops - Fables'>
            <Box
                mt={['0', '0', '0', '2rem', '2rem']}
                width={['95%', '90%', '80%']}
                minHeight='50vh'
                mx='auto'>
                {featured.length > 0 && <FeaturedList featured={featured} />}
                <ArticleList articles={articles} count={count} />
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    const [featured, articles] = await Promise.all([
        fetchFeaturedArticles(),
        fetchArticles({ limit: 20, page: 1 }),
    ])

    if (!articles.items.length) {
        return {
            redirect: {
                destination: '/',
                persistent: false,
            },
        }
    }

    return {
        props: {
            featured: featured.items,
            articles: articles.items,
            count: articles.count,
        },
        revalidate: 10,
    }
}

Articles.defaultProps = {
    articles: [],
    featured: [],
    count: 0,
}

export default Articles
