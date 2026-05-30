import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { computeMetadataDiff } from '@/lib/platform/metadata-diff'

const f = createUploadthing()

type UploadedFile = {
    name: string
    ufsUrl: string
    key: string
    size: number
    type: string
}

export const fileRouter = {
    documentUploader: f({
        'text/csv': { maxFileSize: '32MB', maxFileCount: 10 },
        'application/vnd.ms-excel': { maxFileSize: '32MB', maxFileCount: 5 },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
            maxFileSize: '32MB',
            maxFileCount: 5,
        },
    })
        .input(
            z.object({
                name: z.string().min(1),
                grouped: z.boolean(),
                description: z.unknown().optional(),
                license: z.string().optional(),
                groupId: z.string().uuid().optional(),
                parentId: z.string().uuid().optional(),
                files: z.record(z.record(z.unknown())),
            }),
        )
        .middleware(async ({ req, input }) => {
            type Input = {
                name: string
                grouped: boolean
                description: unknown
                license?: string
                groupId?: string
                parentId?: string
                files: Record<string, Record<string, unknown>>
            }
            const i = input as Input
            const session = await auth.api.getSession({ headers: req.headers })
            return {
                uploadedBy: session?.user.id ?? null,
                name: i.name,
                grouped: i.grouped,
                description: i.description,
                license: i.license ?? null,
                groupId: i.groupId ?? null,
                parentId: i.parentId ?? null,
                filesMetadata: i.files,
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const f = file as unknown as UploadedFile
            const fileMetadata = (metadata.filesMetadata[f.name] ?? null) as DocumentMetadata | null
            const docName = metadata.grouped ? metadata.name : f.name

            const [aiInsights, metadataDiff] = await Promise.all([
                fileMetadata
                    ? generateInsights(docName, fileMetadata).catch((err) => {
                          console.error('[upload/insights] failed for', docName, err instanceof Error ? err.message : err)
                          return null
                      })
                    : Promise.resolve(null),
                (async () => {
                    if (!metadata.parentId || !fileMetadata) return null
                    const parent = await documentService.getById(metadata.parentId).catch(() => null)
                    if (!parent?.metadata) return null
                    return computeMetadataDiff(parent.metadata as DocumentMetadata, fileMetadata)
                })(),
            ])

            const doc = await documentService.create({
                name: docName,
                url: f.ufsUrl,
                storageKey: f.key,
                size: f.size,
                mimeType: f.type,
                uploadedBy: metadata.uploadedBy,
                metadata: fileMetadata,
                description: metadata.description,
                license: metadata.license,
                groupId: metadata.groupId,
                aiInsights,
                parentId: metadata.parentId,
                metadataDiff,
            })
            return { documentId: doc.id, url: doc.url }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter

async function generateInsights(name: string, meta: DocumentMetadata): Promise<string> {
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

    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: `You are a data analyst. Analyze the following dataset and respond with bullet points only — no headers, no prose paragraphs.

Dataset: ${name}
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

Each bullet must be a single clear, specific sentence. No sub-bullets. No section labels.`,
        maxTokens: 1200,
    })

    return text
}
