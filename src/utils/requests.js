/**
    @description module with functions to make requests to the server
*/
import invoke from './axios.config'

/**
 * @description Articles actions
 */

// fetch articles
export async function fetchArticles(term = '') {
    const { data = {} } = await invoke('GET', `articles?keyword=${term}`)
    return data
}
// fetch articles
export async function fetchFeaturedArticles() {
    const { data = {} } = await invoke('GET', `articles/featured`)
    return data
}

// fetch article
export async function fetchArticle(slug) {
    const { data = {} } = await invoke('GET', `articles/title/${slug}`)
    return data
}

// fetch recommended articles
export async function fetchRecommended(title) {
    const { data = {} } = await invoke(
        'GET',
        `articles/recommendations/${title}`
    )
    return data
}

// fetch more articles by author
export async function fetchMoreByAuthor(author) {
    const { data = {} } = await invoke(
        'GET',
        `articles/moreby/${author}?limit=4&page=1`
    )
    return data
}

/**
    @description Datasets actions
*/

// fetch datasets
export async function fetchDatasets(term = '') {
    const { data = {} } = await invoke('GET', `datasets?keyword=${term}`)
    return data
}

// fetch dataset
export async function fetchDataset(slug) {
    const { data = {} } = await invoke('GET', `datasets/dataset/${slug}`)
    return data
}

/**
    @description Application actions
*/

// fetch apps
export async function fetchApps(term = '') {
    const { data = {} } = await invoke('GET', `apps?keyword=${term}`)
    return data
}

// fetch app
export async function fetchApp(slug) {
    const { data = {} } = await invoke('GET', `apps/app/${slug}`)
    return data
}

/**
    @description Community actions
*/

// fetch community
export async function fetchCommunity() {
    const { data = {} } = await invoke('GET', `users`)
    return data
}

// fetch categories
export async function fetchCategories(limit = null) {
    const { data = {} } = await invoke('GET', `category?limit=${limit}`)
    return data
}
