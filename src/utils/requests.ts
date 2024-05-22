import { invoke } from '@/lib/invoke'

// fetch articles
export async function fetchArticles(params = {}) {
    try {
        const search = new URLSearchParams(params)

        const { data = {} } = await invoke(
            'GET',
            `articles?${search.toString()}`
        )

        return data
    } catch (error) {
        return { count: [], articles: [] }
    }
}
// fetch articles
export async function fetchFeaturedArticles() {
    const { data = {} } = await invoke('GET', 'articles/featured')
    return data
}

// fetch article
export async function fetchArticle(slug: string) {
    const { data = {} } = await invoke('GET', `articles/article/${slug}`)
    return data
}

// fetch recommended articles
export async function fetchRecommended(title: string) {
    const search = new URLSearchParams({
        title,
    })
    const { data = {} } = await invoke(
        'GET',
        `articles/recommendations?${search.toString()}`
    )
    return data
}

// fetch more articles by author
export async function fetchMoreByAuthor(authorEmail: string) {
    const search = new URLSearchParams({
        email: authorEmail,
        limit: '4',
        page: ' 1',
    })

    const { data = {} } = await invoke(
        'GET',
        `articles/author?${search.toString()}`
    )
    return data
}

/**
    @description Datasets actions
*/

// fetch datasets
export async function fetchDatasets(params = {}) {
    try {
        const search = new URLSearchParams(params)

        const { data = {} } = await invoke(
            'GET',
            `datasets?${search.toString()}`
        )
        return data
    } catch (error) {
        return { count: [], datasets: [] }
    }
}

// fetch dataset
export async function fetchDataset(slug: string) {
    const { data = {} } = await invoke('GET', `datasets/dataset/${slug}`)
    return data
}

/**
    @description Application actions
*/

// fetch apps
export async function fetchApps(params = {}) {
    try {
        const search = new URLSearchParams(params)

        const { data = {} } = await invoke('GET', `apps?${search.toString()}`)
        return data
    } catch (error) {
        return { apps: [] }
    }
}

// fetch app
export async function fetchApp(slug: string) {
    const { data = {} } = await invoke('GET', `apps/app/${slug}`)
    return data
}

/**
    @description Community actions
*/

// fetch community
export async function fetchCommunity(params = {}) {
    try {
        const search = new URLSearchParams(params)
        const { data = {} } = await invoke('GET', `users?${search.toString()}`)
        return data
    } catch (error) {
        return { users: [] }
    }
}

// fetch categories
export async function fetchCategories(params = {}) {
    try {
        const search = new URLSearchParams(params)
        const { data = {} } = await invoke(
            'GET',
            `categories?${search.toString()}`
        )
        return data
    } catch (error) {
        return { categories: [] }
    }
}
