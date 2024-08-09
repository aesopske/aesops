import { openai } from '@ai-sdk/openai'
// import { kv } from '@vercel/kv'
import { streamText } from 'ai'

export const dynamic = 'force-dynamic' // force dynamic rendering

export const maxDuration = 30 // allow the req to take longer

export async function POST(req: Request) {
    // get the message from the body
    try {
        const { prompt } = await req.json()

        // check if we have the data cached and return it
        // const cached = await kv.get(key)

        const response = await streamText({
            model: openai('gpt-4o'),
            prompt,
            maxTokens: 2000,
            onFinish: async () => {
                //TODO: add support for caching with redis or upstash
                // const cache = kv.set(key, data, { ex: 60 * 60 * 24 * 7 }) // cache for 7 days
                // console.log('cached', cache)
            },
        })

        return response.toDataStreamResponse()
    } catch (error) {
        // Check if the error is an APIError
        throw error
    }
}
