import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const emailEnv = createEnv({
    server: {
        // sender addresses are hardcoded in @repo/email's FROM constants, not env vars
        RESEND_API_KEY: z.string(),
    },
    runtimeEnv: {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
    },
})
