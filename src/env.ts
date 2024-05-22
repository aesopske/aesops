import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
    server: {
        HUGGING_FACE_ACCESS_TOKEN: z.string(),
        OPENAI_API_KEY: z.string(),
        // SANITY_API_READ_TOKEN: z.string(),
    },
    client: {},

    runtimeEnv: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        HUGGING_FACE_ACCESS_TOKEN: process.env.HUGGING_FACE_ACCESS_TOKEN,
        // SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    },
})
