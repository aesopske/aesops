import 'server-only'
import { draftMode } from 'next/headers'
import type { QueryOptions, QueryParams } from 'next-sanity'

import { client } from './client'
// import { env } from '@src/env'

export const token = "" // env.SANITY_API_READ_TOKEN

type FetchOptions = {
    query: string
    params?: QueryParams
    tags?: string[]
}

export async function sanityFetch<QueryResponse>({
    query,
    params = {},
    tags,
}: FetchOptions) {
    const isDraftMode = draftMode().isEnabled

    if (isDraftMode && !token) {
        throw new Error(
            'The `SANITY_API_READ_TOKEN` environment variable is required.'
        )
    }

    return client.fetch<QueryResponse>(query, params, {
        ...(isDraftMode &&
            ({
                token: token,
                perspective: 'previewDrafts',
            } satisfies QueryOptions)),
        next: {
            revalidate: isDraftMode ? 0 : false,
            tags,
        },
    })
}
