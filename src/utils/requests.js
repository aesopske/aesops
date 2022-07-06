import axios from 'axios'

const baseUrl = `${process.env.BASE_URL}/api/v1`
const config = {
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'same-site': 'Secure',
    },
}

// fetch articles
export async function fetchArticles(params = {}) {
    try {
        const search = new URLSearchParams({
            ...params,
        })
        const query = search.toString()
        const url = `articles?${query}`
        const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)

        return data
    } catch (error) {
        return { count: [], articles: [] }
    }
}
// fetch articles
export async function fetchFeaturedArticles() {
    const { data = {} } = await axios.get(
        `${baseUrl}/articles/featured`,
        config
    )
    return data
}

// fetch article
export async function fetchArticle(slug) {
    const { data = {} } = await axios.get(
        `${baseUrl}/articles/article/${slug}`,
        config
    )
    return data
}

// fetch recommended articles
export async function fetchRecommended(title) {
    const search = new URLSearchParams({
        title,
    })
    const { data = {} } = await axios.get(
        `${baseUrl}/articles/recommendations?${search.toString()}`,
        config
    )
    return data
}

// fetch more articles by author
export async function fetchMoreByAuthor(authorEmail = '') {
    const search = new URLSearchParams({
        email: authorEmail,
        limit: 4,
        page: 1,
    })

    const { data = {} } = await axios.get(
        `${baseUrl}/articles/author?${search.toString()}`,
        config
    )
    return data
}

/**
    @description Datasets actions
*/

// fetch datasets
export async function fetchDatasets(params = {}) {
    try {
        const search = new URLSearchParams({
            ...params,
        })
        const query = search.toString()
        const url = `datasets?${query}`

        const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)
        return data
    } catch (error) {
        return { count: [], datasets: [] }
    }
}

// fetch dataset
export async function fetchDataset(slug) {
    const { data = {} } = await axios.get(
        `${baseUrl}/datasets/dataset/${slug}`,
        config
    )
    return data
}

/**
    @description Application actions
*/

// fetch apps
export async function fetchApps(params = {}) {
    try {
        const search = new URLSearchParams({ ...params })
        const query = search.toString()

        const url = `apps?${query}`
        const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)
        return data
    } catch (error) {
        return { apps: [] }
    }
}

// fetch app
export async function fetchApp(slug) {
    const { data = {} } = await axios.get(`${baseUrl}/apps/app/${slug}`, config)
    return data
}

/**
    @description Community actions
*/

// fetch community
export async function fetchCommunity(params = {}) {
    try {
        const search = new URLSearchParams({ ...params })
        const query = search.toString()

        const url = `users?${query}`
        const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)
        return data
    } catch (error) {
        return { users: [] }
    }
}

// fetch categories
export async function fetchCategories(params = {}) {
    try {
        const search = new URLSearchParams({ ...params })
        const query = search.toString()

        const url = `categories?${query}`
        const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)
        return data
    } catch (error) {
        return { categories: [] }
    }
}
