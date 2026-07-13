import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const sanityEnv = createEnv({
    clientPrefix: 'NEXT_PUBLIC_',
    client: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
        NEXT_PUBLIC_SANITY_DATASET: z.string(),
        NEXT_PUBLIC_SANITY_API_VERSION: z.string().default('2024-02-17'),
    },
    server: {
        SANITY_API_TOKEN: z.string().optional(),
        SANITY_REVALIDATE_SECRET: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_SANITY_PROJECT_ID:
            process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        NEXT_PUBLIC_SANITY_API_VERSION:
            process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
        SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
    },
})
