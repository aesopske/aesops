import { neon } from '@neondatabase/serverless'
import type { DocumentMetadata } from '@repo/db/schema'
import { classifyDataset } from '../src/lib/platform/classification'

// Backfills category/tags for existing datasets that predate the
// classification pipeline. Run: pnpm --filter @aesops/web backfill:classification

type Row = {
    id: string
    name: string
    metadata: DocumentMetadata | null
    ai_insights: string | null
}

async function main() {
    const sql = neon(process.env.DATABASE_URL!)

    const docs = (await sql`
        SELECT id, name, metadata, ai_insights
        FROM documents
        WHERE parent_id IS NULL AND category IS NULL
    `) as Row[]

    console.log(`Found ${docs.length} document(s) without a category`)

    let ok = 0
    let skipped = 0
    let failed = 0

    for (const doc of docs) {
        if (!doc.metadata?.columns?.length) {
            console.warn(`⚠ skip ${doc.id}: no column metadata`)
            skipped++
            continue
        }
        try {
            const { category, tags } = await classifyDataset(
                doc.name,
                doc.metadata,
                doc.ai_insights,
            )
            await sql`UPDATE documents SET category = ${category}, tags = ${JSON.stringify(tags)}, classified_at = now(), updated_at = now() WHERE id = ${doc.id}`
            console.log(`✓ ${doc.id} (${doc.name}) → ${category} [${tags.join(', ')}]`)
            ok++
        } catch (err) {
            console.error(`✗ ${doc.id}:`, err instanceof Error ? err.message : err)
            failed++
        }
    }

    console.log(`\nDone. ${ok} classified, ${skipped} skipped, ${failed} failed.`)
    process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
