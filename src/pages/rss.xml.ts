import { generateRssFeed } from '@/utils/rssfeed'
import { fetchArticles } from '@/utils/requests'

function RssFeed() {
    return null
}

export const getServerSideProps = async (ctx) => {
    const { res } = ctx

    const data = await fetchArticles()
    const posts = data.items

    const feed = await generateRssFeed(posts)
    res.setHeader('Content-Type', 'text/xml')
    res.write(feed.atom1())
    res.end()

    return {
        props: {},
    }
}

export default RssFeed
