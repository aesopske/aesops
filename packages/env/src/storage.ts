import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const storageEnv = createEnv({
    server: {
        UPLOADTHING_TOKEN: z.string(),
        UPLOADTHING_URL: z.string().url().optional(),
        // Cloudflare R2 (S3-compatible). Optional during the UploadThing → R2
        // migration; R2Provider enforces their presence at point of use.
        R2_ACCOUNT_ID: z.string().optional(),
        R2_ACCESS_KEY_ID: z.string().optional(),
        R2_SECRET_ACCESS_KEY: z.string().optional(),
        R2_BUCKET: z.string().optional(),
    },
    runtimeEnv: {
        UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
        UPLOADTHING_URL: process.env.UPLOADTHING_URL,
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET: process.env.R2_BUCKET,
    },
})
