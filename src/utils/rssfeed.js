import fs from 'fs'
import { Feed } from 'feed'
import { fetchArticles } from './requests'

export async function generateRssFeed() {
    const data = await fetchArticles()

    const posts = data.items
    const siteURL = process.env.SITE_URL
    const date = new Date()
    const author = {
        name: 'Aesops Author',
        link: 'https://twitter.com/aesopske',
    }

    const feed = new Feed({
        title: 'Aesops blog',
        description: '',
        id: siteURL,
        link: siteURL,
        image: '',
        favicon: `${siteURL}/favicon.ico`,
        copyright: `All rights reserved ${date.getFullYear()}, Aesops`,
        updated: date,
        generator: 'Feed for Node.js',
        feedLinks: {
            rss2: `${siteURL}/rss/feed.xml`,
            json: `${siteURL}/rss/feed.json`,
            atom: `${siteURL}/rss/atom.xml`,
        },
        author,
    })

    if (posts.length) {
        posts.forEach((post) => {
            const url = `${siteURL}/fables/${post?.slug}`

            feed.addItem({
                title: post?.title,
                id: url,
                link: url,
                description: post?.summary,
                content: post?.summary,
                image: post?.image?.url,
                author: [
                    {
                        name: post?.author,
                        link: `${siteURL}/community`,
                    },
                ],
                contributor: [
                    {
                        name: post?.author,
                        link: `${siteURL}/community`,
                    },
                ],
                date: new Date(post?.created),
            })
        })
    }

    fs.mkdirSync('public/rss', { recursive: true })
    fs.writeFileSync('public/rss/feed.xml', feed.rss2())
    fs.writeFileSync('public/rss/atom.xml', feed.atom1())
    fs.writeFileSync('public/rss/json.xml', feed.json1())
}
