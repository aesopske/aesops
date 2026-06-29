import { createRouteHandler } from 'uploadthing/next'
import { fileRouter } from '@/lib/platform/uploadthing'
import { env } from '@/env'

export const { GET, POST } = createRouteHandler({
    router: fileRouter,
    config: {
        token: env.UPLOADTHING_TOKEN,
        isDev: env.NODE_ENV === 'development',
        ...(env.UPLOADTHING_URL && { callbackUrl: `${env.UPLOADTHING_URL}/api/uploadthing` }),
    },
})
