'use client'

import React from 'react'
import { invoke, InvokeOptions } from '@src/lib/invoke'

interface FetchResult<T> {
    loading: boolean
    error: Error | null
    fetch: (opts: InvokeOptions) => Promise<void> //eslint-disable-line
    data: T | null
}

interface FetchOptions extends InvokeOptions {
    disableFetchOnMount?: boolean
}

function useFetch<T>({
    disableFetchOnMount = false,
    ...opts
}: FetchOptions): FetchResult<T> {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)
    const [data, setData] = React.useState<T | null>(null)

    const fetch = React.useCallback(async (opts: InvokeOptions) => {
        setLoading(true)
        setError(null)
        try {
            const response = await invoke({
                ...opts,
            })

            if (response.error) {
                throw new Error(response?.error || 'An error occurred')
            }
            setData(response.res as T)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const stringifiedOpts = JSON.stringify(opts)

    const memoizedOpts = React.useMemo(() => stringifiedOpts, [stringifiedOpts])

    React.useEffect(() => {
        if (disableFetchOnMount) return
        fetch(JSON.parse(memoizedOpts))
    }, [fetch, disableFetchOnMount, memoizedOpts])

    return { data, loading, error, fetch }
}

export default useFetch
