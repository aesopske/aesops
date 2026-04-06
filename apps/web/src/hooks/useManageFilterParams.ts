'use client'

import qs from 'query-string'
import { useCallback, useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

function useManageFilterParams(filterPrefix: string | undefined) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const resetFilters = () => {
        if (!filterPrefix) return
        const params = qs.parse(searchParams.toString()) as Record<string, any>

        // Remove only filters that match the prefix
        Object.keys(params).forEach((key) => {
            if (key.startsWith(filterPrefix)) {
                delete params[key]
            }
        })

        router.replace(`${pathname}?${qs.stringify(params)}`, { scroll: false })
    }

    const cleanParams = useCallback(
        (data: string) => {
            if (!data || !filterPrefix) return ''

            const params = qs.parse(data) as Record<string, any>

            // format the keys to remove the filterPrefix
            Object.keys(params).forEach((key) => {
                const newKey = key.replace(`${filterPrefix}:`, '')
                params[newKey] = params[key]
                delete params[key]
            })

            return qs.stringify(params)
        },
        [filterPrefix],
    )

    let params = useMemo(() => searchParams.toString(), [searchParams])

    if (filterPrefix && searchParams.toString()) {
        // parse the params, filter the params to only include those that match the prefix else return null
        const parsedParams = qs.parse(searchParams.toString()) as Record<
            string,
            any
        >

        // Remove only filters that don't match the prefix
        Object.keys(parsedParams).forEach((key) => {
            if (!key.startsWith(filterPrefix)) {
                delete parsedParams[key]
            }
        })

        params = qs.stringify(parsedParams)
    }

    const cleanedParams = cleanParams(params) ?? ''

    const parsedParams = useMemo(() => {
        const cleaned = cleanParams(params)
        return qs.parse(cleaned, { arrayFormat: 'bracket' })
    }, [params, cleanParams])

    return {
        params,
        cleanParams,
        resetFilters,
        cleanedParams,
        defaultParams: searchParams,
        parsedParams,
    }
}

export default useManageFilterParams
