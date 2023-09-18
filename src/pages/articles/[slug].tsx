import { Suspense, useCallback, useEffect, useState } from 'react'

import { ARTICLE } from '@/types'
import Layout from '@/components/common/Layout'
import ArticlePost from '@/components/Articles/Article/ArticlePost'
import {
    fetchArticle,
    fetchArticles,
    fetchMoreByAuthor,
} from '@/utils/requests'

type ArticleProps = {
    article: ARTICLE
}

function Article({ article }: ArticleProps) {
    const [byAuthor, setByAuthor] = useState([])
    const defaultUrl = article?.image?.url

    const fetchAll = useCallback(async () => {
        const moreFromAuthor = await fetchMoreByAuthor(article.author_email)
        setByAuthor(moreFromAuthor.items)
    }, [article.author_email])

    useEffect(() => {
        if (article) {
            fetchAll()
        }
    }, [article, fetchAll])

    return (
        <Layout
            title={article?.title}
            description={article?.summary}
            imageurl={defaultUrl}
            url={`https://aesops.co.ke/articles/${article?.slug}`}
            isArticle
            ogarticleProps={{
                publishedTime: article?.created,
                modifiedTime: null,
                authors: [article?.author],
                tags: [...article?.tags],
            }}>
            <Suspense fallback={<p>loading ...</p>}>
                <ArticlePost article={article} authorArticles={byAuthor} />
            </Suspense>
        </Layout>
    )
}

export async function getStaticProps(ctx) {
    const { slug } = ctx.params
    const article = await fetchArticle(slug)

    if (!article) {
        return {
            redirect: {
                destination: '/articles',
                permanent: true,
            },
        }
    }

    return {
        props: {
            article: article.item,
        },

        revalidate: 60 * (60 * 2), // 2 hours
    }
}

export async function getStaticPaths() {
    const articles = await fetchArticles({ limit: 100 })

    return {
        paths: articles.items.map((article: ARTICLE) => ({
            params: {
                slug: article.slug,
            },
        })),
        fallback: 'blocking',
    }
}

Article.DefaultProps = {
    article: {},
    authorArticles: [],
    recommendations: [],
}

export default Article
