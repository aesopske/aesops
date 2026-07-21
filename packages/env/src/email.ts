import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const emailEnv = createEnv({
    server: {
        // Resend — sole transactional email provider (auth OTP codes).
        RESEND_API_KEY: z.string(),
        // Resend's "From" header value — either a bare email or "Name <email>".
        EMAIL_FROM: z.string().min(1),
    },
    runtimeEnv: {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
    },
})
