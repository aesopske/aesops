import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
    server: {
        HUGGING_FACE_ACCESS_TOKEN: z.string(),
    },
    client: {},

    runtimeEnv: {
        HUGGING_FACE_ACCESS_TOKEN: process.env.HUGGING_FACE_ACCESS_TOKEN,
    },
})
