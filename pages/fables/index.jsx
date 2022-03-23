import { Box } from '@chakra-ui/react'
import ArticleList from '@/src/components/Articles/ArticleList'
import FeaturedList from '@/src/components/Articles/FeaturedList'
import Layout from '@/src/components/common/Layout'
import { fetchArticles, fetchCategories } from '@/src/utils/requests'

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
    const data = await fetchArticles()
    const resp = await fetchCategories(12)

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
            categories: resp.categories,
        },
    }
}

Articles.defaultProps = {
    articles: [],
    featured: [],
    count: 0,
}

export default Articles
