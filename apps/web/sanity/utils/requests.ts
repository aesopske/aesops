import { groq } from 'next-sanity'
import { MIN_POST, NAV_LINK } from '@apps/web/sanity/utils/types'
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

// fetch page by slug
export const pageQuery = groq`*[_type == 'page' && slug.current == $slug]{
    _id,
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

export const navLinksQuery = groq`*[_type == 'siteSettings'][0]{
    navLinks[]{
        _key,
        name,
        href,
        comingSoon,
    }
}`

export const getNavLinks = async (): Promise<NAV_LINK[]> => {
    const result = await client.fetch<{ navLinks?: NAV_LINK[] }>(
        navLinksQuery,
        {},
        { next: { revalidate: 60, tags: ['sanity:navLinks'] } },
    )
    return result?.navLinks ?? []
}
