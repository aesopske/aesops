import { groq } from 'next-sanity'
import { CATEGORY, CATEGORY_POST, MIN_POST, POST } from '@sanity/utils/types'
import { client } from './client'

// subqueries
const author = groq`{
    name,
    bio,
    image,
    slug,
    isCoreMember,
    socials,
    role
}`

export const postsQuery = groq`*[_type == 'post' && !(_id in path('drafts.**'))] | order(publishedAt desc){
    title,
    slug,
    publishedAt,
    excerpt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    author[]->${author},
  }`

export const getPosts = async () => {
    try {
        const posts = await client.fetch<MIN_POST[]>(postsQuery)
        return posts
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

// get post by slug query
export const postQuery = groq`*[_type == 'post' && slug.current == $slug]{
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
  author[]->{
      name,
      bio,
      slug,
      image,
      isCoreMember,
      role,
      socials,
      "posts": *[_type == 'post' && author._ref == ^._id && slug.current != $slug && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
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
  "recentPosts": *[_type == 'post' && slug.current != $slug && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
    title,
    slug,
    publishedAt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    excerpt,
    author[]->${author}
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

export const featuredQuery = groq`*[_type == 'post' && !(_id in path('drafts.**')) && featured == true]{
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
    author[]->{
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

export const recentQuery = groq`*[_type == 'post' && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3]{
    title,
    slug,
    publishedAt,
    excerpt,
    categories[]->{
        title,
        slug
    },
    "readTime":round(length(pt::text(body)) / 5 / 180 ),
    author[]->{
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

export const categoriesQuery = groq`*[_type == 'category']{
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

export const categoryQuery = groq`*[_type == 'category']{
    title,
    slug,
    description,
    "posts": *[_type == 'post' && references(^._id) && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...4]{
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
        author[]->{
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

export const specificCategoryQuery = groq`*[_type == 'category' && slug.current == $slug]{
    title,
    slug,
    description,
    "posts": *[_type == 'post' && references(^._id) && !(_id in path('drafts.**'))] | order(publishedAt desc) [$offset...$limit]{
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
        author[]->{
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
            queryParams,
        )
        return categories
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

// Fetch Datasets
export const datasetQuery = groq`*[_type == 'dataset']{
    title,
    slug,
    description,
    "categories": *[_type == 'category' && references(^._id)]{
        title,
        slug
    },
    "tags": *[_type == 'tag' && references(^._id)]{
        title,
        slug
    }
}`

export const fetchDatasets = async () => {
    try {
        const datasets = await client.fetch(datasetQuery)
        return datasets
    } catch (error) {
        throw new Error('Error fetching datasets')
    }
}

// Fetch single dataset
export const singleDatasetQuery = groq`*[_type == 'dataset' && slug.current == $slug]{
    title,
    slug,
    description,
    "categories": *[_type == 'category' && references(^._id)]{
        title,
        slug
    },
    "tags": *[_type == 'tag' && references(^._id)]{
        title,
        slug
    }
}[0]`

// fetch featured datasets
export const featuredDatasetQuery = groq`*[_type == 'dataset' && featured == true]{
    title,
    slug,
    description,
    "categories": *[_type == 'category' && references(^._id)]{
        title,
        slug
    },
    "tags": *[_type == 'tag' && references(^._id)]{
        title,
        slug
    }
}`

// fetch page by slug
export const pageQuery = groq`*[_type == 'page' && slug.current == $slug]{
    title,
    slug,
    sections[]{
        ...,
        values[]->{
            ...
        },
        services[]->{
            ...
        },
        featuredPosts[]->{
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
            author[]->{
                name,
                bio,
                image,
                slug,
                isCoreMember,
                socials,
                role
            }
        },
        posts[]->{
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
            author[]->{
                name,
                bio,
                image,
                slug,
                isCoreMember,
                socials,
                role
            }
        },
        datasets[]->{
            ...
        },
        projects[]->{
            ...,
            author[]->{
                name,
                bio,
                image,
                slug,
                isCoreMember,
                socials,
                role
            }
        },
        members[]->{
            name,
            bio,
            image,
            slug,
            isCoreMember,
            socials,
            role
        }
    }
}[0]`

export const pageMetadataQuery = groq`*[_type == 'page' && slug.current == $slug]{
    seoTitle,
    seoDescription,
    ogimage
}[0]`

// authors query
export const membersQuery = groq`*[_type == 'author' && !(_id in path('drafts.**'))]{
    name,
    bio,
    image,
    slug,
    isCoreMember,
    socials,
    role,
}[]`

export const memberQuery = groq`*[_type == 'author' && slug.current == $slug]{
    ...,
    "posts": *[_type == 'post' && references(^._id) && !(_id in path('drafts.**'))] | order(publishedAt desc){
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
        author[]->{
            name,
            bio,
            image,
            slug,
            isCoreMember,
            socials,
            role
        }
    }
}[0]`

// Fetch single member metadata
export const memberMetadataQuery = groq`*[_type == 'author' && slug.current == $slug && isCoreMember == true]{
  name,
  bio,
  image,
  slug,
}[0]`

// Competitions query
export const competitionsQuery = groq`*[_type == 'competition' && !(_id in path('drafts.**'))]{
    title,
    description,
    slug,
    mainImage,
    startDate,
    endDate,
    featured
}[]`

export const competitionQuery = groq`*[_type == 'competition' && slug.current == $slug]{
    ...
}[0]`

export const competitionsMetadataQuery = groq`*[_type == 'competition' && slug.current == $slug]{
    title,
    description,
}[0]`

// Trends query
export const trendsQuery = groq`*[_type == 'project' && !(_id in path('drafts.**'))]{
  ...
  title,
  slug,
  publishedAt,
  author[]->${author}
  }[]`

const description = groq`{
  ...,
  _type == 'blockLink' => @->{
    _type == 'post'=> {
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      author[]->${author},
      categories[]->{
        ...
      },
      "isPost": true
    },
    _type == 'project' => @->{
      ...,
      "isPost": false,
      author[]->${author}
    }
  },
}`

export const trendQuery = groq`*[_type == 'project' && slug.current == $slug]{
  ...,
  description[] ${description},
  author[]->${author}
  }[0]`

export const trendsMetadataQuery = groq`*[_type == 'project' && slug.current == $slug]{
  title,
  slug,
  image,
  seoDescription,
  publishedAt,
  author[]->${author}
  }[0]`

export const featuredTrendsQuery = groq`*[_type == 'project' && featured == true]{
  ...,
  description[] ${description},
  author[]->${author}
  }[]`
