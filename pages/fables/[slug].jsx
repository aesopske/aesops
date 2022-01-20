import Layout from '@/src/components/common/Layout'
import ArticlePost from '@/src/components/Articles/Article/ArticlePost'
import { fetchArticle, fetchMoreByAuthor } from '@/src/utils/requests'
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

export async function getServerSideProps(ctx) {
    try {
        const { slug } = ctx.params
        const article = await fetchArticle(slug)

        if (!article) {
            return {
                redirect: {
                    destination: '/articles',
                    persistant: false,
                },
            }
        }

        // const title = article.item.title
        // const authorEmail = article.item.author_email

        // let recommendations = []
        // let authorArticles = []

        // if (title) {
        //     const data = await fetchRecommended(title)
        //     recommendations = data.items
        // }

        // if (authorEmail) {
        //     const data = await fetchMoreByAuthor(authorEmail)
        //     authorArticles = data.items
        // }

        return {
            props: {
                article: article.item,
                // recommendations,
                // authorArticles,
            },
        }
    } catch (error) {
        return {
            props: {
                error: true,
                article: {},
                recommendations: [],
                authorArticles: [],
            },
        }
    }
}

Article.DefaultProps = {
    article: {},
    authorArticles: [],
    recommendations: [],
}

export default Article
