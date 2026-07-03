import { createEnv } from '@t3-oss/env-nextjs'
import { sanityEnv } from '@repo/env/sanity'
import { observabilityEnv } from '@repo/env/observability'
import { authEnv, storageEnv } from '@repo/env'
import { z } from 'zod'

export const env = createEnv({
    extends: [sanityEnv, authEnv, storageEnv, observabilityEnv],
    server: {
        GEMINI_API_KEY: z.string().optional(),
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
        SANITY_API_TOKEN: z.string({
            message: 'SANITY_API_TOKEN is required',
        }),
    },
    client: {
        NEXT_PUBLIC_DEMO_CREDENTIALS: z.string().optional(),
        NEXT_PUBLIC_AESOPS_API_URL: z.string().optional(),
        NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_AESOPS_API_URL: process.env.NEXT_PUBLIC_AESOPS_API_URL,
        NEXT_PUBLIC_DEMO_CREDENTIALS: process.env.NEXT_PUBLIC_DEMO_CREDENTIALS,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    },
})
