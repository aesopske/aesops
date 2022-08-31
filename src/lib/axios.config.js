import axios from 'axios'

export async function invoke(method, url, data = {}) {
    let config = {
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'same-site': 'Secure',
        },
    }

    const baseUrl = `${process.env.BASE_URL}/api/v1`
    const REQ_URL = `${baseUrl}/${url}`

    const res = await axios({
        method,
        url: REQ_URL,
        data,
        headers: config.headers,
    })

    return res
}
