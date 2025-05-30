import { client } from '~sanity/utils/client'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/env'
import { validatePreviewUrl } from '@sanity/preview-url-secret'

const clientWithToken = client.withConfig({
    token: env.SANITY_API_READ_TOKEN,
})

export async function GET(request: Request) {
    try {
        const { isValid, redirectTo = '/' } = await validatePreviewUrl(
            clientWithToken,
            request.url,
        )

        const { enable } = await draftMode()

        if (!isValid) {
            return new Response('Invalid secret', { status: 401 })
        }

        enable()
        redirect(redirectTo)
    } catch (error) {
        return new Response(
            `Internal server error \n ${JSON.stringify(error)}`,
            { status: 500 },
        )
    }
}
