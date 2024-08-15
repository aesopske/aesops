import { openai } from '@ai-sdk/openai'
import { kv } from '@vercel/kv'
import { streamText, formatStreamPart } from 'ai'

export const dynamic = 'force-dynamic' // force dynamic rendering

export const maxDuration = 30 // allow streamText to run for upto 30 seconds

export async function POST(req: Request) {
    try {
        const { key, prompt } = await req.json()

        const cached = await kv.get<string | null>(key)

        if (cached !== null) {
            return new Response(formatStreamPart('text', cached), {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
            })
        }

        const response = await streamText({
            model: openai('gpt-4o'),
            prompt,
            maxTokens: 512,
            maxRetries: 3,
            onFinish: async ({ text }) => {
                // caching with @vercel/kv
                await kv.set<string>(key, text)
                await kv.expire(key, 60 * 60 * 24) // 24 hours
            },
        })

        return response.toDataStreamResponse()
    } catch (error) {
        // Check if the error is an APIError
        throw error
    }
}
