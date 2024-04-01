import { SanityAsset } from '@sanity/image-url/lib/types/types'

export type CATEGORY = {
    title: string
    slug: {
        current: string
    }
    description: string
}

export type SOCIAL = {
    _key: string
    name: string
    url: string
}

export type SANITY_IMAGE = SanityAsset

export type AUTHOR = {
    name: string
    slug: {
        current: string
    }
    bio?: string
    image: SANITY_IMAGE
    posts?: POST[]
    socials?: SOCIAL[]
    isCoreMember?: boolean
    role?: string
}

export type AUTHOR_PLUS = AUTHOR & {
    initials: string
    photoURL: string
}

export type POST = {
    _id: string
    title: string
    slug: {
        current: string
    }
    author: AUTHOR
    body: any[]
    readTime: number
    categories: CATEGORY[]
    mainImage: SANITY_IMAGE
    publishedAt: string
    excerpt: string
    headings: string[]
    recentPosts: MIN_POST[]
}

export type MIN_POST = Pick<
    POST,
    | 'title'
    | 'slug'
    | 'readTime'
    | 'mainImage'
    | 'publishedAt'
    | 'excerpt'
    | 'author'
    | 'categories'
>

export type PATH = {
    name: string
    href: string
    active: boolean
}

export type CATEGORY_POST = {
    posts: MIN_POST[]
} & CATEGORY
