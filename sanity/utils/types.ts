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
    author: AUTHOR[]
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

// Page types
export type PAGE = {
    _id: string
    _type: string
    title: string
    slug: {
        current: string
    }
    seoTitle: string
    seoDescription: string
    sections: SECTION[]
}

export type PAGE_METADATA = Pick<PAGE, 'slug' | 'seoTitle' | 'seoDescription'>

export type SECTION = {
    _id: string
    _type: string
    title: string
    description?: string
    descriptionContent?: any[]
    cta?: CTA[]
    useBody?: boolean
    image?: SANITY_IMAGE
    posts?: POST[]
    members?: AUTHOR[]
    datasets?: DATASET[]
    values?: VALUE[]
    services?: SERVICE[]
}

export type CTA = {
    _key: string
    _type: string
    label: string
    isExternal?: boolean
    link: string
    variant: 'default' | 'primary' | 'secondary' | 'dark'
}

export type DATASET = {
    _key: string
    _type: string
    title: string
    slug: {
        current: string
    }
    description: string
}

export type VALUE = {
    _key: string
    _type: string
    value: string
    description: string
    icon: string
}

export type SERVICE = {
    _key: string
    _type: string
    title: string
    description: string
    icon: string
}

export type COMPETITION = {
    _key: string
    _type: string
    _createdAt: string
    title: string
    slug: {
        current: string
    }
    description: string
    mainImage: SANITY_IMAGE
    startDate: string
    endDate?: string
    tabs: TAB[]
    keywords: string
    featured?: boolean
}

export type TAB = {
    title: string
    dataset?: DATASET
    content: any[]
}

export type COMPETITION_METADATA = Pick<
    COMPETITION,
    'slug' | 'title' | 'description'
>

export type HOME_SETTINGS = {
    title: string
    description: string
    keywords: string
    ogImage: SanityAsset
}
