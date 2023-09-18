import * as fs from 'fs'
import path from 'path'

function Sitemap() {
    return null
}

export const getServerSideProps = async ({ res }) => {
    const BASE_URL = process.env.SITE_URL
    const prod = process.env.NODE_ENV === 'production'

    let files

    if (prod) {
        files = fs.readdirSync(path.join(__dirname))
    } else {
        files = fs.readdirSync('pages')
    }

    const staticPaths = files
        .filter((staticPage) => {
            return ![
                'api',
                '_app.js',
                '_document.js',
                '404.js',
                'sitemap.xml.js',
                'rss.xml.js',
                '_error.js',
                '500.js',
            ].includes(staticPage)
        })
        .map((staticPagePath) => {
            return `${BASE_URL}/${staticPagePath.replace('.js', '')}`
        })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPaths.map((url) => {
        return `
        <url>
            <loc>${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>`
    })}
    </urlset>
    `

    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {
        props: {},
    }
}

export default Sitemap
