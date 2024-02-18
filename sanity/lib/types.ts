export type CATEGORY = {
    title: string
    description: string
}

export type POST = {
    _id: string
    title: string
    slug: {
        current: string
    }
    author: {
        name: string
        image: {
            alt: string
            asset: {
                url: string
            }
        }
    }
    categories: CATEGORY[]
    mainImage: {
        alt: string
        asset: {
            url: string
        }
    }
    publishedAt: string
    excerpt: string
}

export type MIN_POST = Pick<
    POST,
    | 'title'
    | 'slug'
    | 'mainImage'
    | 'publishedAt'
    | 'excerpt'
    | 'author'
    | 'categories'
>
