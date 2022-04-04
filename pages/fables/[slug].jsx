import Layout from '@/src/components/common/Layout'
import ArticlePost from '@/src/components/Articles/Article/ArticlePost'
import {
    fetchArticle,
    fetchArticles,
    fetchMoreByAuthor,
} from '@/src/utils/requests'
import { useEffect, useState } from 'react'

function Article({ article }) {
    const [byAuthor, setByAuthor] = useState([])

    let defaultUrl

    if (article?.image?.url) {
        defaultUrl = article?.image?.url
    } else {
        defaultUrl =
            'https://firebasestorage.googleapis.com/v0/b/aesops-ke.appspot.com/o/aesops-seo.png?alt=media&token=33e1fc5e-68cb-435f-9d1e-466bd0ad5dd6'
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (article) {
                const fetchAll = async () => {
                    const moreFromAuthor = await fetchMoreByAuthor(
                        article.author_email
                    )

                    setByAuthor(moreFromAuthor.items)
                }

                fetchAll()
            }
        }
    }, [article])

    return (
        <Layout
            title={article?.title}
            description={article?.summary}
            imageurl={defaultUrl}
            url={`https://aesops.co.ke/articles/${article?.slug}`}>
            <ArticlePost article={article} authorArticles={byAuthor} />
        </Layout>
    )
}

export async function getStaticProps(ctx) {
    const { slug } = ctx.params
    const article = await fetchArticle(slug)

    if (!article) {
        return {
            redirect: {
                destination: '/fables',
                persistant: false,
            },
        }
    }

    return {
        props: {
            article: article.item,
        },

        revalidate: 10,
    }
}

export async function getStaticPaths() {
    const articles = await fetchArticles({ limit: 100 })

    return {
        paths: articles.items.map((article) => ({
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
