import { MetadataRoute } from 'next'
import { sanityFetch } from '@sanity/utils/fetch'
import { postsQuery } from '@sanity/utils/requests'
import { POST } from '@sanity/utils/types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const BASE_URL = 'https://aesops.co.ke'
    // get the posts from the CMS and generate the sitemap
    const posts = await sanityFetch<POST[]>({
        query: postsQuery,
    })

    // update the format
    const postUrls = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug.current}`,
        changeFrequency: 'monthly' as const,
        lastModified: new Date(post?.publishedAt),
    }))

    return [
        {
            url: `${BASE_URL}/`,
            changeFrequency: 'monthly',
            priority: 1,
            lastModified: new Date(),
        },
        {
            url: `${BASE_URL}/about-us`,
            changeFrequency: 'monthly',
            priority: 1,
            lastModified: new Date(),
        },

        {
            url: `${BASE_URL}/blog`,
            changeFrequency: 'monthly',
            priority: 1,
            lastModified: new Date(),
        },
        {
            url: `${BASE_URL}/blog/contribute`,
            changeFrequency: 'yearly',
            lastModified: new Date(),
        },
        ...postUrls,
        {
            url: `${BASE_URL}/data-digest`,
            changeFrequency: 'monthly',
            priority: 1,
            lastModified: new Date(),
        },
        {
            url: `${BASE_URL}/data-digest/oilprices`,
            changeFrequency: 'monthly',
            priority: 1,
            lastModified: new Date(),
        },
    ]
}
