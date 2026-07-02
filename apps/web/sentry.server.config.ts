import * as Sentry from '@sentry/nextjs'
import { observabilityEnv } from '@repo/env/observability'

Sentry.init({
    dsn: observabilityEnv.SENTRY_DSN,
    tracesSampleRate: 0.1,
})
