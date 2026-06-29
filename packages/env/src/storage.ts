import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const storageEnv = createEnv({
    server: {
        UPLOADTHING_TOKEN: z.string(),
        UPLOADTHING_URL: z.string().url().optional(),
    },
    runtimeEnv: {
        UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
        UPLOADTHING_URL: process.env.UPLOADTHING_URL,
    },
})
