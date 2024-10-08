import axios, { AxiosError, Method, AxiosRequestHeaders } from 'axios'
import { env } from '@src/env'

export const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // 'Access-Control-Allow-Origin': env.NEXT_PUBLIC_AESOPS_API_URL,
    // 'Access-Control-Allow-Credentials': 'true',
}

export type InvokeOptions = {
    method?: Method
    endpoint: string
    data?: Record<string, any>
    options?: {
        headers?: AxiosRequestHeaders
    }
    useBaseUrl?: boolean
}

export type InvokeResponse<T> = Promise<{
    res: T | null
    status?: number | undefined
    error: string | null
}>

export async function invoke<T>({
    data,
    options,
    endpoint,
    method = 'GET',
    useBaseUrl = true,
}: InvokeOptions): InvokeResponse<T> {
    const config = {
        headers,
    }

    const BASE_URL = env.NEXT_PUBLIC_AESOPS_API_URL

    if (!BASE_URL && useBaseUrl) {
        throw new Error('BASE_URL is not defined')
    }

    let REQUEST_URL = endpoint

    if (useBaseUrl) {
        REQUEST_URL = `${BASE_URL}${endpoint}`
    }

    const { headers: optionHeaders, ...opts } = options || {}
    try {
        const { data: res, status } = await axios({
            method,
            url: REQUEST_URL,
            data,
            headers: {
                ...config.headers,
                ...optionHeaders,
            },
            withCredentials: true,
            ...opts,
        })

        return { res, status, error: null }
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error?.response) {
                if (error.response.data.message || error.response.data.detail) {
                    const message =
                        error.response.data.message ||
                        error.response.data.detail
                    return {
                        res: null,
                        status: error.response.status,
                        error: message,
                    }
                }

                return {
                    res: null,
                    status: error.response.status,
                    error: error.response.data,
                }
            } else if (error.request) {
                return {
                    res: null,
                    status: error.response?.status,
                    error: 'Error: No response received from the request',
                }
            } else {
                return {
                    res: null,
                    status: error.response?.status,
                    error: error.message,
                }
            }
        }

        return {
            res: null,
            status: error.response?.status,
            error: error.message,
        }
    }
}
