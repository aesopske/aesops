import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = '2024-02-17'

export const client = createClient({
    dataset,
    projectId,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
})
