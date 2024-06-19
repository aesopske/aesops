import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
    server: {
        OPENAI_API_KEY: z.string({ message: 'OPENAI_API_KEY is required' }),
        SANITY_API_READ_TOKEN: z.string({
            message: 'SANITY_API_READ_TOKEN is required',
        }),
    },
    client: {},
    runtimeEnv: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    },
})
