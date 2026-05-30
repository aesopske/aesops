import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const storageEnv = createEnv({
    server: {
        UPLOADTHING_TOKEN: z.string(),
    },
    runtimeEnv: {
        UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    },
})
