import { Box } from '@chakra-ui/react'
import ArticleList from '@/src/components/Articles/ArticleList'
import FeaturedList from '@/src/components/Articles/FeaturedList'
import Layout from '@/src/components/common/Layout'
import { fetchArticles, fetchFeaturedArticles } from '@/src/utils/requests'
import Promise from 'promise'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorHandler from '@/src/components/common/ErrorHandler'

function Articles({ articles, featured, count, cookieConsent }) {
    return (
        <Layout title='Aesops - Fables' cookieConsent={cookieConsent}>
            <Box
                mt={['0', '0', '0', '2rem', '2rem']}
                width={['95%', '90%', '80%']}
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
