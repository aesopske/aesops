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
        console.log(clientWithToken.config().token)
        const {
            isValid,
            redirectTo = '/',
            studioOrigin,
        } = await validatePreviewUrl(clientWithToken, request.url)

        console.log(studioOrigin)

        if (!isValid) {
            return new Response('Invalid secret', { status: 401 })
        }

        draftMode().enable()
        redirect(redirectTo)
    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}
