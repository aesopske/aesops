import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createClient } from 'next-sanity'
import { groq } from 'next-sanity'
import { streamText, formatDataStreamPart } from 'ai'
import { captureException } from '@sentry/core'
import { env } from '@/env'
import { apiVersion, dataset, projectId } from '~sanity/env'
import { client } from '~sanity/utils/client'
import { recordAiUsage } from '@/lib/platform/ai-usage'
import { logger } from '@/lib/platform/logger'

const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY })

const ROUTE = 'completion'
const MODEL = 'gemini-2.5-flash'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Write-capable client — only active when SANITY_API_WRITE_TOKEN is set
const writeClient = env.SANITY_API_TOKEN
    ? createClient({
          projectId,
          dataset,
          apiVersion,
          useCdn: false,
          token: env.SANITY_API_TOKEN,
      })
    : null

const CACHE_TTL_HOURS = 6

// Sanity document IDs allow: letters, digits, hyphens, underscores
function cacheDocId(key: string) {
    return `aicache-${key.replace(/[^a-zA-Z0-9-]/g, '_')}`
}

export async function POST(req: Request) {
    const { key, prompt, useCache, useRefreshCache } = await req.json()

    const docId = key ? cacheDocId(key) : null

    // Cache read — TTL enforced in GROQ via dateTime comparison
    if (docId && !useRefreshCache) {
        const cached = await client
            .fetch<
                string | null
            >(groq`*[_type == "aiCache" && _id == $id && dateTime(expiresAt) > dateTime(now())][0].value`, { id: docId })
            .catch(() => null)

        if (cached !== null) {
            return new Response(formatDataStreamPart('text', cached), {
                status: 200,
                headers: { 'Content-Type': 'text/plain' },
            })
        }
    }

    const startedAt = Date.now()

    const response = streamText({
        model: google(MODEL),
        prompt,
        maxRetries: 3,
        maxTokens: 2000,
        onFinish: async ({ text, usage }) => {
            recordAiUsage({
                route: ROUTE,
                model: MODEL,
                latencyMs: Date.now() - startedAt,
                success: true,
                usage,
            })
            if (!useCache || !docId || !writeClient) return
            const expiresAt = new Date(
                Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000,
            ).toISOString()
            await writeClient
                .createOrReplace({
                    _type: 'aiCache',
                    _id: docId,
                    value: text,
                    expiresAt,
                })
                .catch((err) => logger.error(ROUTE, 'failed to write cache doc', { err: String(err) }))
        },
    })

    return response.toDataStreamResponse({
        getErrorMessage: (err) => {
            const msg = err instanceof Error ? err.message : String(err)
            captureException(err, { tags: { route: ROUTE } })
            logger.error(ROUTE, msg)
            recordAiUsage({
                route: ROUTE,
                model: MODEL,
                latencyMs: Date.now() - startedAt,
                success: false,
                errorMessage: msg,
            })
            return msg
        },
    })
}
