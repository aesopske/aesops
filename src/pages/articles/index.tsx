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
            <ErrorBoundary FallbackComponent={ErrorHandler}>
                <div className='container max-w-screen-xl mx-auto min-h-screen'>
                    <FeaturedList featured={featured} />
                    <ArticleList articles={articles} />
                </div>
            </ErrorBoundary>
        </Layout>
    )
}

export async function getStaticProps() {
    const featured = await fetchFeaturedArticles()
    const articles = await fetchArticles({ limit: 0, page: 1 })

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
