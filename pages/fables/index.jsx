import { Box } from '@chakra-ui/react'
import ArticleList from '@/src/components/Articles/ArticleList'
import FeaturedList from '@/src/components/Articles/FeaturedList'
import Layout from '@/src/components/common/Layout'
import {
    fetchArticles,
    fetchCategories,
    fetchFeaturedArticles,
} from '@/src/utils/requests'
import Promise from 'promise'

function Articles({ articles, featured, count, categories }) {
    return (
        <Layout title='Aesops - Fables'>
            <Box
                mt={['0', '0', '0', '2rem', '2rem']}
                width={['95%', '90%', '80%']}
                minHeight='50vh'
                mx='auto'>
                {featured.length > 0 && <FeaturedList featured={featured} />}
                <ArticleList
                    articles={articles}
                    count={count}
                    categories={categories}
                />
            </Box>
        </Layout>
    )
}

export async function getServerSideProps() {
    const [featured, articles, categories] = await Promise.all([
        fetchFeaturedArticles(),
        fetchArticles({ limit: 0 }),
        fetchCategories(12),
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
            categories: categories.categories,
        },
    }
}

Articles.defaultProps = {
    articles: [],
    featured: [],
    count: 0,
}

export default Articles
