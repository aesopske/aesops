import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const observabilityEnv = createEnv({
    server: {
        // Provisioned automatically by the Sentry ⇄ Vercel integration.
        SENTRY_DSN: z.string().optional(),
        SENTRY_ORG: z.string().optional(),
        SENTRY_PROJECT: z.string().optional(),
        SENTRY_AUTH_TOKEN: z.string().optional(),
    },
    runtimeEnv: {
        SENTRY_DSN: process.env.SENTRY_DSN,
        SENTRY_ORG: process.env.SENTRY_ORG,
        SENTRY_PROJECT: process.env.SENTRY_PROJECT,
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    },
})
