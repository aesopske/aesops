import { groq } from 'next-sanity'
import { client } from '@/lib/sanity/client'
import { CATEGORY_POST, MIN_POST, POST, CATEGORY } from '@sanity/lib/types'

const query = groq`*[_type == 'post']{
    title,
    slug,
    publishedAt,
    excerpt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    author->{
        name,
        bio,
        image,
        slug,
        isCoreMember,
        socials,
        role 
    }
  }`

export const getPosts = async () => {
    try {
        const posts = await client.fetch<MIN_POST[]>(query)
        return posts
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

// get post by slug query
const postQuery = groq`*[_type == 'post' && slug.current == $slug]{
  title,
  slug,
  mainImage,
  publishedAt,
  body,
  categories[]->{
        title,
        slug
    },
  "headings": body[length(style)==2 && string::startsWith(style, "h")],
  "readTime":round(length(pt::text(body)) / 5 / 180 ),
  excerpt,
  categories,
  author->{
      name,
      bio,
      slug,
      image,
      isCoreMember,
      role,
      socials,
      "posts": *[_type == 'post' && author._ref == ^._id && slug.current != $slug] | order(publishedAt desc) [0...3] {
          title,
          slug,
          categories[]->{
                title,
                slug
          },
          publishedAt,
          "readTime":round(length(pt::text(body)) / 5 / 180 ),
          excerpt,
      },
  },
  "recentPosts": *[_type == 'post' && slug.current != $slug] | order(publishedAt desc) [0...3] {
    title,
    slug,
    publishedAt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    excerpt,
    author->{
        name,
        bio,
        slug,
        image,
        isCoreMember,
        role,
        socials,
    }
}
}[0]`

export const getPostBySlug = async (slug: string) => {
    try {
        const post = await client.fetch<POST>(postQuery, { slug })
        return post
    } catch (error) {
        throw new Error(error)
    }
}

// fetch featured articles

const featuredQuery = groq`*[_type == 'post' && featured == true]{
    title,
    slug,
    publishedAt,
    mainImage,
    excerpt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    author->{
        name,
        bio,
        image,
        slug,
        isCoreMember,
        socials,
        role 
    }
  }`

export const fetchFeaturedArticles = async () => {
    try {
        const posts = await client.fetch<MIN_POST[]>(featuredQuery)
        return posts
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

// fetch recent posts

const recentQuery = groq`*[_type == 'post'] | order(publishedAt desc) [0...3]{
    title,
    slug,
    publishedAt,
    excerpt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    author->{
        name,
        bio,
        image,
        slug,
        isCoreMember,
        socials,
        role 
    }
  }`

export const fetchRecentPosts = async () => {
    try {
        const posts = await client.fetch<MIN_POST[]>(recentQuery)
        return posts
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

// fetch all categories

const categoriesQuery = groq`*[_type == 'category']{
    title,
    slug,
    description
  }`

export const fetchCategories = async () => {
    try {
        const categories = await client.fetch<CATEGORY[]>(categoriesQuery)
        return categories
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

// fetch top 4 category posts based on number of posts per category

const categoryQuery = groq`*[_type == 'category']{
    title,
    slug,
    description,
    "posts": *[_type == 'post' && references(^._id)] | order(publishedAt desc) [0...4]{
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        categories[]->{
            title,
            slug
        },
        "readTime":round(length(pt::text(body)) / 5 / 180 ),
        author->{
            name,
            bio,
            image,
            slug,
            isCoreMember,
            socials,
            role 
        }
    }
  }`

const specificCategoryQuery = groq`*[_type == 'category' && slug.current == $slug]{
    title,
    slug,
    description,
    "posts": *[_type == 'post' && references(^._id)] | order(publishedAt desc) [$offset...$limit]{
        title,
        slug,
        mainImage,
        publishedAt,
        excerpt,
        categories[]->{
            title,
            slug
        },
        "readTime":round(length(pt::text(body)) / 5 / 180 ),
        author->{
            name,
            bio,
            image,
            slug,
            isCoreMember,
            socials,
            role 
        }
    }
  }`

export const fetchCategoryPosts = async (params: {
    search: string
    page: number
    limit: number
}) => {
    try {
        let page = 1
        let limit = params?.limit ?? 10
        let offset = 0

        if (params.page) {
            page = params.page
            offset = (page - 1) * limit
        }

        const query = params.search ? specificCategoryQuery : categoryQuery

        const queryParams = params.search
            ? { slug: params.search, offset, limit }
            : {}

        const categories = await client.fetch<CATEGORY_POST[]>(
            query,
            queryParams
        )
        return categories
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}
