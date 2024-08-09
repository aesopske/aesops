import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// import { NextResponse } from 'next/server'

// import { env } from '@/env'

// create new huggingface Inference instance
// const openai = new OpenAI({
//     apiKey: env.OPENAI_API_KEY,
// })

export const dynamic = 'force-dynamic' // force dynamic rendering

export const maxDuration = 30 // allow the req to take longer

export async function POST(req: Request) {
    // get the message from the body
    try {
        const { prompt } = await req.json()

        const response = await streamText({
            model: openai('gpt-4o'),
            prompt,
            maxTokens: 2000,
            onFinish: (data) => {
                console.log('onFinish', data)
            },
        })

        return response.toDataStreamResponse()
    } catch (error) {
        // Check if the error is an APIError
        throw error
    }
}
