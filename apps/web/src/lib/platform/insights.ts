import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import type { DocumentMetadata } from '@repo/db/schema'

// Descriptions are stored as Tiptap/ProseMirror JSON; flatten to plain text
// for the prompt. Marks (bold, italic, …) are dropped, block boundaries become
// newlines.
const BLOCK_TYPES = new Set(['paragraph', 'heading', 'listItem'])

function tiptapToPlainText(node: unknown): string {
    if (!node || typeof node !== 'object') return ''
    const n = node as { type?: string; text?: string; content?: unknown[] }
    if (n.text) return n.text
    const inner = (n.content ?? []).map(tiptapToPlainText).join('')
    return n.type && BLOCK_TYPES.has(n.type) ? `${inner}\n` : inner
}

export async function generateInsights(
    name: string,
    meta: DocumentMetadata,
    description?: unknown,
): Promise<{ text: string; usage: Awaited<ReturnType<typeof generateText>>['usage'] }> {
    const descriptionText = description ? tiptapToPlainText(description).trim() : ''
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

    const { text, usage } = await generateText({
        model: google('gemini-2.5-flash'),
        providerOptions: {
            google: { thinkingConfig: { thinkingBudget: 0 } },
        },
        prompt: `You are a data analyst. Analyze the following dataset and respond with a one-line summary followed by bullet points — no headers, no other prose paragraphs.

Dataset: ${name}
Rows: ${meta.rowCount.toLocaleString()} · Columns: ${meta.columnCount}${meta.analyzedSheet ? ` · Sheet: ${meta.analyzedSheet}` : ''}
${descriptionText ? `\nDescription provided by the uploader:\n${descriptionText}\n` : ''}
Columns:
${columnSummary}

Sample rows:
${sampleRowsText}

First line: a single plain-text line starting with "SUMMARY:" followed by a 1–2 sentence, human-readable description of what this dataset contains — written so it can stand alone as the dataset's public description (no markdown, no mention of "this dataset" being analyzed by AI). Then a blank line.

Then respond with markdown dash bullets (- ) covering:
- What this dataset is about (1–2 bullets)
- Notable patterns or characteristics in the data (2–3 bullets)
- Data quality observations: nulls, outliers, skew, or anomalies (1–2 bullets)
- 2–3 specific questions this data could help answer

Each bullet must be a single clear, specific sentence. No sub-bullets. No section labels.`,
        maxTokens: 1200,
    })

    return { text, usage }
}
