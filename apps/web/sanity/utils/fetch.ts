import 'server-only'
import { env } from '@/env'
import { client } from './client'

type QueryParams = Record<string, unknown>

export const token = env.SANITY_API_TOKEN

type FetchOptions = {
    query: string
    params?: QueryParams
    draftMode?: boolean
}

export async function sanityFetch<QueryResponse>({
    query,
    params = {},
    draftMode = false,
}: FetchOptions): Promise<QueryResponse> {
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
