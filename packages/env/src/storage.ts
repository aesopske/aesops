import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const storageEnv = createEnv({
    server: {
        // Cloudflare R2 (S3-compatible) — the sole storage provider.
        R2_ACCOUNT_ID: z.string(),
        R2_ACCESS_KEY_ID: z.string(),
        R2_SECRET_ACCESS_KEY: z.string(),
        R2_BUCKET: z.string(),
    },
    runtimeEnv: {
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET: process.env.R2_BUCKET,
    },
})
