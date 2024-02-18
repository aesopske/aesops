import { client } from '@/lib/sanity/client'
import { MIN_POST } from '@sanity/lib/types'

const query = `*[_type == 'post']{
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    categories,
  }`

export const getPosts = async () => {
    try {
        const posts = await client.fetch<MIN_POST[]>(query)
        return posts
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}
