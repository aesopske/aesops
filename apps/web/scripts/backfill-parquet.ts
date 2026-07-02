import { neon } from '@neondatabase/serverless'
import { R2Provider } from '@repo/storage/providers/r2'
import type { DocumentMetadata } from '@repo/db/schema'
import { fileToParquet } from '../src/lib/platform/parquet'

// Backfills the derived Parquet artifact for existing datasets that predate the
// Parquet pipeline. Run: pnpm --filter @aesops/web backfill:parquet

type Row = {
    id: string
    provider: string
    storage_key: string
    url: string
    metadata: DocumentMetadata | null
}

async function main() {
    const sql = neon(process.env.DATABASE_URL!)
    const r2 = new R2Provider()

    const docs = (await sql`
        SELECT id, provider, storage_key, url, metadata
        FROM documents
        WHERE parquet_key IS NULL
    `) as Row[]

    console.log(`Found ${docs.length} document(s) without Parquet`)

    let ok = 0
    let skipped = 0
    let failed = 0

    for (const doc of docs) {
        const cols = doc.metadata?.columns
        if (!cols?.length) {
            console.warn(`⚠ skip ${doc.id}: no column metadata`)
            skipped++
            continue
        }
        try {
            const readUrl =
                doc.provider === 'uploadthing'
                    ? doc.url
                    : await r2.getSignedDownloadUrl(doc.storage_key)
            const res = await fetch(readUrl)
            if (!res.ok) throw new Error(`fetch source failed (${res.status})`)
            const buffer = await res.arrayBuffer()

            const parquet = await fileToParquet(buffer, cols)
            const key = `parquet/${doc.id}.parquet`
            await r2.putObject(key, parquet, 'application/vnd.apache.parquet')
            await sql`UPDATE documents SET parquet_key = ${key}, updated_at = now() WHERE id = ${doc.id}`

            console.log(`✓ ${doc.id} → ${key} (${parquet.length} bytes)`)
            ok++
        } catch (err) {
            console.error(`✗ ${doc.id}:`, err instanceof Error ? err.message : err)
            failed++
        }
    }

    console.log(`\nDone. ${ok} converted, ${skipped} skipped, ${failed} failed.`)
    process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
