import { createRouteHandler } from 'uploadthing/next'
import { fileRouter } from '@/lib/platform/uploadthing'

export const { GET, POST } = createRouteHandler({
    router: fileRouter,
    config: {
        token: process.env.UPLOADTHING_TOKEN,
        isDev: process.env.NODE_ENV === 'development',
    },
})
