import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        OPENAI_API_KEY: z.string({ message: 'OPENAI_API_KEY is required' }),
        SANITY_API_READ_TOKEN: z.string({
            message: 'SANITY_API_READ_TOKEN is required',
        }),
        CLERK_SECRET_KEY: z.string({
            message: 'CLERK_SECRET_KEY is required',
        }),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string({
            message: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required',
        }),
        NEXT_PUBLIC_DEMO_CREDENTIALS: z.string().optional(),
        NEXT_PUBLIC_AESOPS_API_URL: z.string().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_AESOPS_API_URL: process.env.NEXT_PUBLIC_AESOPS_API_URL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        NEXT_PUBLIC_DEMO_CREDENTIALS: process.env.NEXT_PUBLIC_DEMO_CREDENTIALS,
    },
})
