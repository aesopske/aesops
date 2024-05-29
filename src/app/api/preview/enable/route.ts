import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { validatePreviewUrl } from '@sanity/preview-url-secret'

import { env } from '@/env'
import { client } from '~sanity/utils/client'

const clientWithToken = client.withConfig({
    token: env.SANITY_API_READ_TOKEN,
})

export async function GET(request: Request) {
    try {
        const { isValid, redirectTo = '/' } = await validatePreviewUrl(
            clientWithToken,
            request.url,
        )

        if (!isValid) {
            return new Response('Invalid secret', { status: 401 })
        }

        draftMode().enable()
        redirect(redirectTo)
    } catch (error) {
        return new Response('Internal server error', { status: 500 })
    }
}
