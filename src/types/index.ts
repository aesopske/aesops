export type APP = {
    _id: string
    title: string
    link: string
    article: string
    dataset: string
    description: string
    author: string
    author_email: string
    updated: string
    created: string
    slug: string
    published: boolean
}

export type IMAGE = {
    pub_id: string
    url: string
}

export type ARTICLE = {
    _id: string
    id?: string
    title: string
    image?: IMAGE
    tags?: string[]
    summary?: string
    author: string
    author_email?: string
    author_image?: string
    body: string
    slug: string
    published: boolean
    updated: string
    created: string
}

export type CATEGORY = {
    id: string
    name: string
    updated: string
    created: string
}

export type DATASET = {
    _id: string
    id?: string
    link?: string
    slug: string
    title: string
    author: string
    body?: string
    article?: string
    description?: string
    author_email?: string
    published: boolean
    updated: string
    created: string
}

export type USER = {
    _id?: string
    id?: string
    name: string
    email: string
    photourl?:
        | string
        | {
              url: string
          }
    photoURL?: string
    occupation?: string
    company?: string
    description?: string
    languages?: string[]
    portfolio?: string[]
    experience?: string
}
