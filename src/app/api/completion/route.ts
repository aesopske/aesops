import { google } from '@ai-sdk/google'
// import { openai } from '@ai-sdk/openai'
import { Redis } from '@upstash/redis'
import { streamText, formatDataStreamPart } from 'ai'

export const dynamic = 'force-dynamic' // force dynamic rendering

export const maxDuration = 30 // allow streamText to run for upto 30 seconds

const kv = Redis.fromEnv()

export async function POST(req: Request) {
    try {
        const { key, prompt, useCache, useRefreshCache } = await req.json()

        const cached = useRefreshCache ? null : await kv.get<string | null>(key)

        if (cached !== null) {
            return new Response(formatDataStreamPart('text', cached), {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
            })
        }

        const response = streamText({
            // model: openai('gpt-4o'),
            model: google('gemini-2.0-flash-exp'),
            prompt,
            maxRetries: 3,
            maxTokens: 2000,
            onFinish: async ({ text }) => {
                // caching with @vercel/kv
                if (useCache) {
                    await kv.set<string>(key, text)
                    await kv.expire(key, 60 * 60 * 6) // 6 hours
                }
            },
        })

        return response.toDataStreamResponse()
    } catch (error) {
        // Check if the error is an APIError
        throw error
    }
}
