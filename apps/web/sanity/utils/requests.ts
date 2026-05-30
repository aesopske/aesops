import { groq } from 'next-sanity'
import {
    CATEGORY,
    CATEGORY_POST,
    MIN_POST,
    NAV_LINK,
    POST,
} from '@apps/web/sanity/utils/types'
import { client } from './client'

// subqueries — resolves both internal (team reference) and external author shapes
const author = groq`{
    isExternal,
    "name": coalesce(name, teamMember->name),
    "bio": coalesce(bio, teamMember->bio),
    "image": coalesce(image, teamMember->image),
    "slug": coalesce(slug, teamMember->slug),
    "role": teamMember->role,
    "socials": coalesce(socials, teamMember->socials),
    "isCoreMember": teamMember->showOnPage,
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
      isExternal,
      "name": coalesce(name, teamMember->name),
      "bio": coalesce(bio, teamMember->bio),
      "slug": coalesce(slug, teamMember->slug),
      "image": coalesce(image, teamMember->image),
      "role": teamMember->role,
      "socials": coalesce(socials, teamMember->socials),
      "isCoreMember": teamMember->showOnPage,
      "posts": *[_type == 'post' && references(^._id) && slug.current != $slug && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
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
        throw new Error(String(error))
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
    author[]->${author}
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
    author[]->${author}
  }`

export const fetchRecentPosts = async () => {
    try {
        const posts = await client.fetch<MIN_POST[]>(recentQuery)
        return posts
    } catch (error) {
        throw new Error('Error fetching posts')
    }
}

export const getRecentPosts = async (count: number = 6) => {
    const query = groq`*[_type == 'post' && !(_id in path('drafts.**'))] | order(publishedAt desc) [0..$limit]{
        title,
        slug,
        publishedAt,
        excerpt,
        categories[]->{ title, slug },
        "readTime": round(length(pt::text(body)) / 5 / 180),
        author[]->${author}
    }`
    return await client.fetch<MIN_POST[]>(query, { limit: count - 1 })
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
        author[]->${author}
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
        author[]->${author}
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
    pageType,
    // blog-specific fields (null for non-blog pages)
    mainImage,
    excerpt,
    publishedAt,
    "readTime": round(length(pt::text(body)) / 5 / 180),
    body,
    author[]->${author},
    categories[]->{ title, slug },
    featured,
    sections[]{
        _key,
        _type,
        _type == 'heroBlock' => {
            title,
            description,
            image,
            cta,
        },
        _type == 'pageHeroBlock' => {
            label,
            heading,
            description,
            textAlign,
            backgroundColor,
        },
        _type == 'blogListBlock' => {
            heading,
            description,
        },
        _type == 'featuredPostsBlock' => {
            heading,
            "posts": posts[]->{
                title,
                slug,
                publishedAt,
                excerpt,
                mainImage,
                categories[]->{ title, slug },
                "readTime": round(length(pt::text(body)) / 5 / 180),
                author[]->${author}
            },
        },
        _type == 'recentPostsBlock' => {
            heading,
            description,
            count,
        },
        _type == 'featuresBlock' => {
            overline,
            heading,
            description,
            image,
            variant,
            ctaLabel,
            ctaLink,
            features[]{
                _key,
                icon,
                title,
                description,
                link,
                linkLabel,
            },
        },
        _type == 'ourStoryBlock' => {
            heading,
            description,
            image,
        },
        _type == 'missionVisionBlock' => {
            missionTitle,
            missionDescription,
            visionTitle,
            visionDescription,
        },
        _type == 'ourValuesBlock' => {
            heading,
            description,
        },
        _type == 'ourTeamBlock' => {
            heading,
            description,
        },
    }
}[0]`

export const pageMetadataQuery = groq`*[_type == 'page' && slug.current == $slug]{
    pageType,
    title,
    excerpt,
    mainImage,
    seoTitle,
    seoDescription,
    ogimage
}[0]`

// fetch all value documents for the values block
export const valuesQuery = groq`*[_type == 'value'] | order(_createdAt asc){
    "_key": _id,
    value,
    description,
    icon,
}`

export const getValues = async () => {
    return client.fetch(valuesQuery)
}

// fetch core members for the team block
export const coreMembersQuery = groq`*[_type == 'team' && showOnPage == true && !(_id in path('drafts.**'))] | order(name asc){
    name,
    bio,
    image,
    slug,
    showOnPage,
    socials,
    role,
}`

export const getCoreMembers = async () => {
    return client.fetch(coreMembersQuery)
}

// team member queries (for profile pages)
export const membersQuery = groq`*[_type == 'team' && !(_id in path('drafts.**'))]{
    name,
    bio,
    image,
    slug,
    showOnPage,
    socials,
    role,
}[]`

export const memberQuery = groq`*[_type == 'team' && slug.current == $slug]{
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
        author[]->${author}
    }
}[0]`

// Fetch single member metadata
export const memberMetadataQuery = groq`*[_type == 'team' && slug.current == $slug && showOnPage == true]{
  name,
  bio,
  image,
  slug,
}[0]`

export const navLinksQuery = groq`*[_type == 'siteSettings'][0]{
    navLinks[]{
        _key,
        name,
        href,
        comingSoon,
    }
}`

export const getNavLinks = async (): Promise<NAV_LINK[]> => {
    const result = await client.fetch<{ navLinks?: NAV_LINK[] }>(navLinksQuery)
    return result?.navLinks ?? []
}

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
    }
  },
}`
