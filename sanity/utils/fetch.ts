import 'server-only'
import type { QueryParams } from 'next-sanity'
import { env } from '@src/env'
import { client } from './client'

export const token = env.SANITY_API_READ_TOKEN

type FetchOptions = {
    query: string
    params?: QueryParams
    draftMode?: boolean
}

export async function sanityFetch<QueryResponse>({
    query,
    params = {},
    draftMode = false,
}: FetchOptions) {
    const perspect = draftMode ? 'previewDrafts' : 'published'
    if (perspect === 'previewDrafts') {
        return client.fetch<QueryResponse>(query, params, {
            stega: true || process.env.VERCEL_ENV === 'preview',
            perspective: 'previewDrafts',
            token,
            useCdn: false,
            next: { revalidate: 0 },
        })
    }

    return client.fetch<QueryResponse>(query, params, {
        stega: false || process.env.VERCEL_ENV == 'preview',
        perspective: 'published',
        token,
        useCdn: true,
        next: { revalidate: 60 },
    })
}
