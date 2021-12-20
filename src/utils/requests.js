/**
    @description module with functions to make requests to the server
*/
import axios from 'axios'

const BASEURL = `${process.env.BASE_URL}/api/v1`

function config() {
    const config = {
        headers: {
            'Content-type': 'application/json',
        },
    }

    return config
}

/**
 * @description Articles actions
 */

// fetch articles
export async function fetchArticles(term = '') {
    try {
        const { data = {} } = await axios.get(
            `${BASEURL}/articles?keyword=${term}`,
            config()
        )
        return data
    } catch (error) {
        // find a way to send errors to slack
        return { items: [], count: 0 }
    }
}
// fetch articles
export async function fetchFeaturedArticles() {
    const { data = {} } = await axios.get(
        `${BASEURL}/articles/featured`,
        config()
    )
    return data
}

// fetch article
export async function fetchArticle(slug) {
    const { data = {} } = await axios.get(
        `${BASEURL}/articles/title/${slug}`,
        config()
    )

    return data
}

// fetch recommended articles
export async function fetchRecommended(title) {
    const { data = {} } = await axios.get(
        `${BASEURL}/articles/recommendations/${title}`,
        config()
    )
    return data
}

// fetch more articles by author
export async function fetchMoreByAuthor(author) {
    const { data = {} } = await axios.get(
        `${BASEURL}/articles/author/${author}?limit=4&page=1`,
        config()
    )
    return data
}

/**
    @description Datasets actions
*/

// fetch datasets
export async function fetchDatasets(term = '') {
    try {
        const { data = {} } = await axios.get(
            `${BASEURL}/datasets?keyword=${term}`,
            config()
        )
        return data
    } catch (error) {
        // find a way to send errors to slack
        return { items: [], count: 0 }
    }
}

// fetch dataset
export async function fetchDataset(slug) {
    const { data = {} } = await axios.get(
        `${BASEURL}/datasets/dataset/${slug}`,
        config()
    )

    return data
}

/**
    @description Application actions
*/

// fetch apps
export async function fetchApps(term = '') {
    try {
        const { data = {} } = await axios.get(
            `${BASEURL}/apps?keyword=${term}`,
            config()
        )
        return data
    } catch (error) {
        // find a way to send errors to slack
        return { items: [], count: 0 }
    }
}

// fetch app
export async function fetchApp(slug) {
    const { data = {} } = await axios.get(
        `${BASEURL}/apps/app/${slug}`,
        config()
    )

    return data
}

/**
    @description Community actions
*/

// fetch community
export async function fetchCommunity() {
    const { data = {} } = await axios.get(`${BASEURL}/users`, config())
    return data
}
