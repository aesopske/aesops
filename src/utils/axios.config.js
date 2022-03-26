import axios from 'axios'

export default async function invoke(method, path, data = {}) {
    const url = `${process.env.BASE_URL}/api/v1/${path}`
    const config = {
        headers: {
            'Content-Type': 'application/json',
            SameSite: 'Secure',
        },
    }

    const res = await axios({
        method,
        url,
        data,
        headers: config.headers,
    })

    return res
}
