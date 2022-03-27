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
export async function fetchArticles(term = '') {
    try {
        let url
        if (term) {
            url = `/articles?keyword=${term}`
        } else {
            url = '/articles'
        }
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
        `${baseUrl}/articles/title/${slug}`,
        config
    )
    return data
}

// fetch recommended articles
export async function fetchRecommended(title) {
    const { data = {} } = await axios.get(
        `${baseUrl}/articles/recommendations/${title}`,
        config
    )
    return data
}

// fetch more articles by author
export async function fetchMoreByAuthor(author = '') {
    const { data = {} } = await axios.get(
        `${baseUrl}/articles/moreby/${author}?limit=4&page=1`,
        config
    )
    return data
}

/**
    @description Datasets actions
*/

// fetch datasets
export async function fetchDatasets(term = '') {
    try {
        let url
        if (term) {
            url = `/datasets?keyword=${term}`
        } else {
            url = '/datasets'
        }

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
export async function fetchApps(term = '') {
    let url
    if (term) {
        url = `/apps?keyword=${term}`
    } else {
        url = '/apps'
    }

    const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)

    return data
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
export async function fetchCommunity() {
    const { data = {} } = await axios.get(`${baseUrl}/users`, config)
    return data
}

// fetch categories
export async function fetchCategories(limit = null) {
    try {
        let url
        if (limit) {
            url = `/category?limit=${limit}`
        } else {
            url = '/category'
        }
        const { data = {} } = await axios.get(`${baseUrl}/${url}`, config)

        return data
    } catch (error) {
        return { categories: [] }
    }
}
