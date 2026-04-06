import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/studio/', '/_next/', '/vercel/'],
        },
        sitemap: 'https://aesops.co.ke/sitemap.xml',
    }
}
