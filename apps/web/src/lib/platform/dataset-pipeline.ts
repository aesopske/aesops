import 'server-only'
import { captureException } from '@sentry/core'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { fileToParquet } from '@/lib/platform/parquet'
import { mergeDatasetToParquet } from '@/lib/platform/dataset-merge-parquet'
import { generateInsights } from '@/lib/platform/insights'
import { recordAiUsage } from '@/lib/platform/ai-usage'
import { logger } from '@/lib/platform/logger'

type DocumentRow = NonNullable<Awaited<ReturnType<typeof documentService.getById>>>

export type ConvertToParquetResult =
    | { ok: true; parquetKey: string; skipped?: boolean }
    | { ok: false; reason: 'no_columns' | 'conversion_failed' }

// Generates the derived Parquet artifact for a single document (version) and
// records its `parquetKey`. Idempotent — returns the existing key if one is
// already recorded. Shared by the browser-triggered `/api/datasets/[id]/parquet`
// route and the programmatic scraper upload endpoint.
export async function convertDocumentToParquet(
    doc: DocumentRow,
): Promise<ConvertToParquetResult> {
    if (doc.parquetKey) {
        return { ok: true, parquetKey: doc.parquetKey, skipped: true }
    }

    const meta = doc.metadata as DocumentMetadata | null
    if (!meta?.columns?.length) {
        return { ok: false, reason: 'no_columns' }
    }

    try {
        const readUrl = await documentService.resolveReadUrl(doc)
        const res = await fetch(readUrl)
        if (!res.ok) throw new Error(`Failed to fetch source file (${res.status})`)
        const buffer = await res.arrayBuffer()

        const parquet = await fileToParquet(buffer, meta.columns)
        const key = `parquet/${doc.id}.parquet`
        await documentService.putObject(key, parquet, 'application/vnd.apache.parquet')
        await documentService.setParquetKey(doc.id, key)

        return { ok: true, parquetKey: key }
    } catch (err) {
        console.error(
            '[dataset-pipeline] parquet conversion failed for',
            doc.id,
            err instanceof Error ? err.message : err,
        )
        return { ok: false, reason: 'conversion_failed' }
    }
}

const AI_INSIGHTS_ROUTE = 'ai/insights'
const AI_INSIGHTS_MODEL = 'gemini-2.5-flash'

// Generates and persists the AI insights summary for a document. Shared by the
// browser-triggered `/api/ai/insights` route and the scraper upload endpoint.
// Best-effort: failures are logged/reported but never thrown, so a slow or
// failed AI call never fails the upload it was triggered by.
export async function generateAndSaveInsights(
    doc: DocumentRow,
    docName: string,
    metadata: DocumentMetadata,
): Promise<void> {
    const startedAt = Date.now()
    try {
        const { text, usage } = await generateInsights(docName, metadata, doc.description)
        await documentService.saveInsights(doc.id, text)
        recordAiUsage({
            route: AI_INSIGHTS_ROUTE,
            model: AI_INSIGHTS_MODEL,
            userId: doc.uploadedBy,
            latencyMs: Date.now() - startedAt,
            success: true,
            usage,
        })
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        captureException(err, { tags: { route: AI_INSIGHTS_ROUTE } })
        logger.error(AI_INSIGHTS_ROUTE, 'failed to generate insights', { docName, err: msg })
        recordAiUsage({
            route: AI_INSIGHTS_ROUTE,
            model: AI_INSIGHTS_MODEL,
            userId: doc.uploadedBy,
            latencyMs: Date.now() - startedAt,
            success: false,
            errorMessage: msg,
        })
    }
}

export type MergeVersionsResult =
    | { ok: true; parquetKey: string }
    | { ok: true; skipped: true }
    | { ok: false; reason: 'no_rows' | 'too_large' }

// Merges every version of a dataset (root + revisions) into a single deduped
// Parquet artifact recorded on the root as `mergedParquetKey`. Waits until every
// version has its own Parquet before combining, so queries never see partial
// data. Shared by `/api/datasets/[id]/merge` and the scraper upload endpoint.
export async function mergeDatasetVersions(
    root: DocumentRow,
): Promise<MergeVersionsResult> {
    const revisions = await documentService.listRevisions(root.id)
    const allDocs = [root, ...revisions]

    if (allDocs.some((d) => !d.parquetKey)) {
        return { ok: true, skipped: true }
    }

    return mergeDatasetToParquet(root, allDocs)
}
