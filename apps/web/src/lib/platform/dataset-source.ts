import 'server-only'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { registerParquet } from './duckdb'
import { fileToParquet } from './parquet'
import type { DatasetQuery } from './dataset-query'

export type OpenableDoc = {
    provider: string
    storageKey: string
    url: string
    parquetKey: string | null
    metadata: unknown
}

export type OpenDataset = { dq: DatasetQuery; release: () => void }

// Opens a dataset for querying: loads its Parquet artifact (or converts the
// original on the fly if the background conversion hasn't run yet), registers it
// in DuckDB, and returns a DatasetQuery plus a release() to drop it afterwards.
export async function openDataset(doc: OpenableDoc): Promise<OpenDataset | null> {
    const meta = doc.metadata as DocumentMetadata | null
    if (!meta?.columns?.length) return null

    let parquet: Uint8Array
    if (doc.parquetKey) {
        const url = await documentService.getParquetUrl(doc.parquetKey)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to fetch Parquet (${res.status})`)
        parquet = new Uint8Array(await res.arrayBuffer())
    } else {
        const url = await documentService.resolveReadUrl(doc)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed to fetch source file (${res.status})`)
        parquet = new Uint8Array(await fileToParquet(await res.arrayBuffer(), meta.columns))
    }

    const handle = await registerParquet(parquet)
    return {
        dq: { run: handle.query, ref: handle.ref, columns: meta.columns },
        release: handle.release,
    }
}
