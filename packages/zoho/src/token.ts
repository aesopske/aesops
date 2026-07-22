import { zohoEnv } from '@repo/env/zoho'

const REFRESH_BUFFER_MS = 5 * 60 * 1000

// Per-instance, best-effort cache — fine given ~1hr token lifetime and low lead volume.
let cached: { accessToken: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
    if (cached && Date.now() < cached.expiresAt - REFRESH_BUFFER_MS) {
        return cached.accessToken
    }

    const response = await fetch(`https://accounts.zoho.${zohoEnv.ZOHO_DC}/oauth/v2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: zohoEnv.ZOHO_CLIENT_ID,
            client_secret: zohoEnv.ZOHO_CLIENT_SECRET,
            refresh_token: zohoEnv.ZOHO_REFRESH_TOKEN,
        }),
    })

    if (!response.ok) {
        throw new Error(`Zoho token refresh failed: ${response.status} ${await response.text()}`)
    }

    const data = (await response.json()) as { access_token: string; expires_in: number }
    cached = { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
    return cached.accessToken
}
