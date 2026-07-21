import 'server-only'
import { Resend } from 'resend'
import { emailEnv } from '@repo/env/email'

export const resend = new Resend(emailEnv.RESEND_API_KEY)

/** No Resend key configured yet (e.g. local dev) — log instead of failing every send. */
export const emailDeliveryConfigured = Boolean(emailEnv.RESEND_API_KEY)
