import { zohoEnv } from '@repo/env/zoho'
import { getAccessToken } from './token'

export const zohoApiBase = `https://www.zohoapis.${zohoEnv.ZOHO_DC}/bigin/v2`

export const zohoCrmConfigured = Boolean(
    zohoEnv.ZOHO_CLIENT_ID && zohoEnv.ZOHO_CLIENT_SECRET && zohoEnv.ZOHO_REFRESH_TOKEN,
)

export async function zohoFetch(path: string, init: RequestInit): Promise<unknown> {
    if (!zohoCrmConfigured) {
        throw new Error('Zoho Bigin is not configured (missing client id/secret/refresh token)')
    }

    const accessToken = await getAccessToken()

    const response = await fetch(`${zohoApiBase}${path}`, {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`Zoho Bigin API error: ${response.status} ${await response.text()}`)
    }

    return response.json()
}
