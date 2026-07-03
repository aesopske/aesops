import 'server-only'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { fileToParquet } from './parquet'
import type { DatasetQuery } from './dataset-query'
import { runRemoteQuery, sqlStringLiteral } from './duckdb-executor-client'

export type OpenableDoc = {
    provider: string
    storageKey: string
    url: string
    parquetKey: string | null
    metadata: unknown
}

export type OpenDataset = { dq: DatasetQuery; release: () => void }

// Opens a dataset for querying: resolves a signed URL to its Parquet artifact
// (converting the original on the fly, then uploading that as a temporary
// object, if the background conversion hasn't run yet) and returns a
// DatasetQuery that runs SQL against it via the remote DuckDB executor.
export async function openDataset(doc: OpenableDoc): Promise<OpenDataset | null> {
    const meta = doc.metadata as DocumentMetadata | null
    if (!meta?.columns?.length) return null

    let parquetUrl: string
    let tempKey: string | null = null
    if (doc.parquetKey) {
        parquetUrl = await documentService.getParquetUrl(doc.parquetKey)
    } else {
        const sourceUrl = await documentService.resolveReadUrl(doc)
        const res = await fetch(sourceUrl)
        if (!res.ok) throw new Error(`Failed to fetch source file (${res.status})`)
        const parquet = new Uint8Array(await fileToParquet(await res.arrayBuffer(), meta.columns))
        tempKey = `tmp-parquet/${crypto.randomUUID()}.parquet`
        await documentService.putObject(tempKey, parquet, 'application/octet-stream')
        parquetUrl = await documentService.getParquetUrl(tempKey)
    }

    return {
        dq: {
            run: runRemoteQuery,
            ref: `read_parquet(${sqlStringLiteral(parquetUrl)})`,
            columns: meta.columns,
        },
        release: () => {
            // Best-effort — the on-the-fly conversion path is a rare fallback
            // for datasets the background parquet job hasn't reached yet, and
            // these temp objects are small; leaving one behind on failure
            // isn't worth blocking or retrying the request over.
            if (tempKey) documentService.deleteObject(tempKey).catch(() => {})
        },
    }
}
