import 'server-only'
import { draftMode } from 'next/headers'
import type { ClientPerspective, QueryParams } from 'next-sanity'

import { env } from '@src/env'
import { client } from './client'

export const token = env.SANITY_API_READ_TOKEN

type FetchOptions = {
    query: string
    params?: QueryParams
    perspective?: Omit<ClientPerspective, 'raw'>
    stega?: boolean
}

export async function sanityFetch<QueryResponse>({
    query,
    params = {},
    perspective = draftMode().isEnabled ? 'previewDrafts' : 'published',
    stega = perspective === 'previewDrafts' ||
        process.env.VERCEL_ENV === 'preview',
}: FetchOptions) {
    if (perspective === 'previewDrafts') {
        return client.fetch<QueryResponse>(query, params, {
            stega,
            perspective: 'previewDrafts',
            token,
            useCdn: false,
            next: { revalidate: 0 },
        })
    }

    return client.fetch<QueryResponse>(query, params, {
        stega,
        perspective: 'published',
        token,
        useCdn: true,
        next: { revalidate: 60 },
    })
}
