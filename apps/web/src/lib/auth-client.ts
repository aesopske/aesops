'use client'
import { createAuthClient, inferAdditionalFields } from '@repo/auth/client'
import type { Auth } from '@repo/auth/client'

export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<Auth>()],
})
