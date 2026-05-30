import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'

const bodySchema = z.object({ id: z.string() }).passthrough()

export async function POST(req: Request) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return new Response('Invalid JSON', { status: 400 })
    }

    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
        return new Response('Missing dataset id', { status: 400 })
    }
    const { id } = parsed.data

    const doc = await documentService.getById(id)
    if (!doc) {
        return new Response('Dataset not found', { status: 404 })
    }

    const meta = doc.metadata as DocumentMetadata | null
    if (!meta) {
        return new Response('No metadata available for this dataset', { status: 422 })
    }

    const columnSummary = meta.columns
        .map((col) => {
            const parts = [`  - ${col.name} (${col.dtype})`]
            if (col.nullPercent > 0) parts.push(`${col.nullPercent.toFixed(1)}% null`)
            if (col.mean !== undefined) parts.push(`mean=${col.mean}, min=${col.min}, max=${col.max}`)
            if (col.topValues?.length) {
                const top = col.topValues.slice(0, 3).map((v) => `"${v.value}" (${v.count})`).join(', ')
                parts.push(`top values: ${top}`)
            }
            return parts.join(' · ')
        })
        .join('\n')

    const sampleRowsText = meta.sampleRows?.length
        ? JSON.stringify(meta.sampleRows.slice(0, 5), null, 2)
        : 'Not available'

    const prompt = `You are a data analyst. Analyze the following dataset and respond with bullet points only — no headers, no prose paragraphs.

Dataset: ${doc.name}
Rows: ${meta.rowCount.toLocaleString()} · Columns: ${meta.columnCount}${meta.analyzedSheet ? ` · Sheet: ${meta.analyzedSheet}` : ''}

Columns:
${columnSummary}

Sample rows:
${sampleRowsText}

Respond with markdown dash bullets (- ) covering:
- What this dataset is about (1–2 bullets)
- Notable patterns or characteristics in the data (2–3 bullets)
- Data quality observations: nulls, outliers, skew, or anomalies (1–2 bullets)
- 2–3 specific questions this data could help answer

Each bullet must be a single clear, specific sentence. No sub-bullets. No section labels.`

    const result = streamText({
        model: google('gemini-2.5-flash'),
        prompt,
        maxTokens: 1200,
        onFinish: async ({ text }) => {
            await documentService.saveInsights(id, text).catch((err) => {
                console.error('[ai/analyze] failed to save insights for', id, err instanceof Error ? err.message : err)
            })
        },
    })

    return result.toDataStreamResponse({
        getErrorMessage: (err) => {
            const msg = err instanceof Error ? err.message : String(err)
            console.error('[ai/analyze]', msg)
            return msg
        },
    })
}
