import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const zohoEnv = createEnv({
    server: {
        ZOHO_CLIENT_ID: z.string(),
        ZOHO_CLIENT_SECRET: z.string(),
        ZOHO_REFRESH_TOKEN: z.string(),
        ZOHO_DC: z.enum(['eu', 'com', 'in', 'com.au', 'jp', 'com.cn', 'ca', 'sa']).default('eu'),
    },
    runtimeEnv: {
        ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID,
        ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
        ZOHO_REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN,
        ZOHO_DC: process.env.ZOHO_DC,
    },
})
