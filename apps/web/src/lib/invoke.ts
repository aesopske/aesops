import axios, { AxiosError, Method, AxiosRequestHeaders } from 'axios'
import { env } from '@/env'

export const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
}

export type InvokeOptions = {
    method?: Method
    endpoint: string
    data?: Record<string, unknown>
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

type ApiErrorData = {
    message?: string
    detail?: string
}

export async function invoke<T>({
    data,
    options,
    endpoint,
    method = 'GET',
    useBaseUrl = true,
}: InvokeOptions): InvokeResponse<T> {
    const config = { headers }

    const BASE_URL = env.NEXT_PUBLIC_AESOPS_API_URL

    if (!BASE_URL && useBaseUrl) {
        throw new Error('BASE_URL is not defined')
    }

    const REQUEST_URL = useBaseUrl ? `${BASE_URL}${endpoint}` : endpoint

    const { headers: optionHeaders, ...opts } = options ?? {}

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
            if (error.response) {
                const responseData = error.response.data as ApiErrorData
                const message = responseData?.message ?? responseData?.detail

                if (message) {
                    return {
                        res: null,
                        status: error.response.status,
                        error: message,
                    }
                }

                return {
                    res: null,
                    status: error.response.status,
                    error: String(error.response.data),
                }
            }

            if (error.request) {
                return {
                    res: null,
                    status: undefined,
                    error: 'No response received from the server',
                }
            }

            return {
                res: null,
                status: undefined,
                error: error.message,
            }
        }

        return {
            res: null,
            status: undefined,
            error:
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred',
        }
    }
}
