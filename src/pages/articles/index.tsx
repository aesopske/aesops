import { Box } from '@chakra-ui/react'
import { ErrorBoundary } from 'react-error-boundary'

import { ARTICLE } from '@/types'
import Layout from '@/components/common/Layout'
import ArticleList from '@/components/Articles/ArticleList'
import ErrorHandler from '@/components/common/ErrorHandler'
import FeaturedList from '@/components/Articles/FeaturedList'
import { fetchArticles, fetchFeaturedArticles } from '@/utils/requests'

type ArticlesProps = {
    articles: ARTICLE[]
    featured: ARTICLE[]
}

function Articles({ articles, featured }: ArticlesProps) {
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
                    <ArticleList articles={articles} />
                </ErrorBoundary>
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    const featured = await fetchFeaturedArticles()
    const articles = await fetchArticles({ limit: 100, page: 1 })

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
