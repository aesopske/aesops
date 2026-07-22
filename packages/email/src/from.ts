// one sender per email "voice" — hardcoded, not env-driven
export const FROM = {
    auth: 'Aesops <auth@aesops.co.ke>',
    welcome: 'Aesops <info@aesops.co.ke>',
    contact: 'Aesops <info@aesops.co.ke>',
    consultation: 'Aesops <consultancy@aesops.co.ke>',
} as const

// internal inboxes that receive form-submission notifications, routed by lead source
export const TEAM_NOTIFY_EMAIL = {
    contact: 'info@aesops.co.ke',
    consultation: 'consultancy@aesops.co.ke',
} as const
