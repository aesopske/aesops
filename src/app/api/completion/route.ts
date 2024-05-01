import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

import { env } from '@/env'
import { NextResponse } from 'next/server'

// create new huggingface Inference instance
const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
})

export const dynamic = 'force-dynamic' // force dynamic rendering

export async function POST(req: Request) {
    // get the message from the body
    try {
        const { prompt } = await req.json()

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 2000,
            stream: true,
            prompt,
        })

        // convert the response to a stream
        const stream = OpenAIStream(response)

        // return the stream
        return new StreamingTextResponse(stream)
    } catch (error) {
        // Check if the error is an APIError
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error

            return NextResponse.json(
                { name, status, headers, message },
                { status }
            )
        } else {
            throw error
        }
    }
}
