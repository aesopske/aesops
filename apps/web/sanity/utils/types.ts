import { SanityAsset } from '@sanity/image-url/lib/types/types'

export type NAV_LINK = {
    _key: string
    name: string
    href: string
    comingSoon?: boolean
}

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

export type TEAM = {
    name: string
    slug: {
        current: string
    }
    bio?: string
    image: SANITY_IMAGE
    posts?: POST[]
    socials?: SOCIAL[]
    showOnPage?: boolean
    role?: string
}

// Resolved author shape returned by GROQ (fields coalesced from team member or external fields)
export type AUTHOR = {
    isExternal?: boolean
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
    isPost?: boolean
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
    | 'isPost'
>

export type PATH = {
    name: string
    href: string
    active: boolean
}

export type CATEGORY_POST = {
    posts: MIN_POST[]
} & CATEGORY

// Block types
export type HeroBlock = {
    _key: string
    _type: 'heroBlock'
    title: string
    description?: string
    image?: SANITY_IMAGE
    cta?: CTA[]
}

export type BlogListBlock = {
    _key: string
    _type: 'blogListBlock'
    heading?: string
    description?: string
}

export type FeaturedPostsBlock = {
    _key: string
    _type: 'featuredPostsBlock'
    heading?: string
    posts: MIN_POST[]
}

export type PageHeroBlock = {
    _key: string
    _type: 'pageHeroBlock'
    label?: string
    heading: string
    description?: string
    textAlign?: 'left' | 'center' | 'right'
    backgroundColor?: 'primary' | 'dark' | 'accent' | 'light'
    visualization?: 'none' | 'consulting' | 'contact'
}

export type FeatureItem = {
    _key: string
    icon?: string
    title: string
    description: string
    link?: string
    linkLabel?: string
}

export type FeaturesBlock = {
    _key: string
    _type: 'featuresBlock'
    overline?: string
    heading?: string
    description?: string
    image?: SANITY_IMAGE
    variant?: 'light' | 'dark'
    features?: FeatureItem[]
    ctaLabel?: string
    ctaLink?: string
}

export type RecentPostsBlock = {
    _key: string
    _type: 'recentPostsBlock'
    heading?: string
    description?: string
    count?: number
}

export type OurStoryBlock = {
    _key: string
    _type: 'ourStoryBlock'
    heading: string
    description?: string
    image?: SANITY_IMAGE & { alt?: string }
}

export type MissionVisionBlock = {
    _key: string
    _type: 'missionVisionBlock'
    missionTitle: string
    missionDescription?: string
    visionTitle: string
    visionDescription?: string
}

export type OurValuesBlock = {
    _key: string
    _type: 'ourValuesBlock'
    heading?: string
    description?: string
}

export type OurTeamBlock = {
    _key: string
    _type: 'ourTeamBlock'
    heading?: string
    description?: string
}

export type AiShowcaseBlock = {
    _key: string
    _type: 'aiShowcaseBlock'
    overline?: string
    heading?: string
    description?: string
    ctaLabel?: string
    ctaLink?: string
}

export type LeadFormBlock = {
    _key: string
    _type: 'leadFormBlock'
    variant: 'consultation' | 'contact'
    heading: string
    description?: string
    submitLabel?: string
    successMessage?: string
}

export type ContactDetailsBlock = {
    _key: string
    _type: 'contactDetailsBlock'
    heading?: string
    description?: string
}

export type PageBlock = HeroBlock | PageHeroBlock | BlogListBlock | FeaturedPostsBlock | RecentPostsBlock | FeaturesBlock | OurStoryBlock | MissionVisionBlock | OurValuesBlock | OurTeamBlock | AiShowcaseBlock | LeadFormBlock | ContactDetailsBlock

export type HOME_PAGE = Omit<PAGE, 'sections'> & {
    sections: PageBlock[]
}

// Page types
export type PAGE = {
    _id: string
    _type: string
    title: string
    slug: { current: string }
    pageType?: 'page' | 'blog' | 'legal'
    seoTitle: string
    seoDescription: string
    ogimage?: SANITY_IMAGE
    sections: SECTION[]
    // blog-type fields
    mainImage?: SANITY_IMAGE
    excerpt?: string
    publishedAt?: string
    readTime?: number
    body?: any[]
    author?: AUTHOR[]
    categories?: CATEGORY[]
    featured?: boolean
}

export type SECTION = {
    _id: string
    _type: string
    title: string
    description?: string
    descriptionContent?: any[]
    cta?: CTA[]
    useBody?: boolean
    image?: SANITY_IMAGE
    featuredPosts?: MIN_POST[]
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

