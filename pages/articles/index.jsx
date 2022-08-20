import { Box } from '@chakra-ui/react'
import ArticleList from '@/src/components/Articles/ArticleList'
import FeaturedList from '@/src/components/Articles/FeaturedList'
import Layout from '@/src/components/common/Layout'
import { fetchArticles, fetchFeaturedArticles } from '@/src/utils/requests'
import Promise from 'promise'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorHandler from '@/src/components/common/ErrorHandler'

function Articles({ articles, featured, count }) {
    return (
        <Layout title='Aesops - Articles'>
            <Box
                mt={['0', '0', '0', '2rem', '3rem']}
                width={['95%', '90%', '80%', '', '75%']}
                minHeight='50vh'
                mx='auto'>
                <ErrorBoundary FallbackComponent={ErrorHandler}>
                    {featured.length > 0 && (
                        <FeaturedList featured={featured} />
                    )}
                    <ArticleList articles={articles} count={count} />
                </ErrorBoundary>
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    const [featured, articles] = await Promise.all([
        fetchFeaturedArticles(),
        fetchArticles({ limit: 50, page: 1 }),
    ])

    if (!articles && !featured) {
        return {
            props: {
                articles: [],
                featured: [],
                count: 0,
            },
        }
    }

    return {
        props: {
            featured: featured.items,
            articles: articles.items,
            count: articles.count,
        },
        revalidate: 60 * (60 * 2), // 2 hours
    }
}

Articles.defaultProps = {
    articles: [],
    featured: [],
    count: 0,
}

export default Articles
