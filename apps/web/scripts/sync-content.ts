import { createClient } from '@sanity/client'

// Copies specific documents from one Sanity dataset to another via the
// regular Content API (createOrReplace) — a free-tier alternative to the
// paid dataset-sync/environments feature for one-off content syncs
// (e.g. after publishing something in `development` that also needs to
// exist in `production`). Only syncs the documents you name; it does not
// touch anything else in the target dataset.
//
// Run: pnpm --filter @aesops/web sync-content -- <docId> [docId...]
//      pnpm --filter @aesops/web sync-content -- --from development --to production <docId>

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-02-17'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required')
if (!token) throw new Error('SANITY_API_TOKEN is required')

function parseArgs(argv: string[]) {
    let from = 'development'
    let to = 'production'
    const ids: string[] = []

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i]
        if (arg === '--from') from = argv[++i] ?? from
        else if (arg === '--to') to = argv[++i] ?? to
        else if (arg && arg !== '--') ids.push(arg)
    }

    return { from, to, ids }
}

function datasetClient(dataset: string) {
    return createClient({ projectId, dataset, apiVersion, token, useCdn: false })
}

async function main() {
    const { from, to, ids } = parseArgs(process.argv.slice(2))

    if (ids.length === 0) {
        console.error(
            'Usage: sync-content [--from <dataset>] [--to <dataset>] <docId> [docId...]',
        )
        process.exit(1)
    }
    if (from === to) throw new Error(`--from and --to must differ (both "${from}")`)

    const source = datasetClient(from)
    const target = datasetClient(to)

    console.log(`Syncing ${ids.length} document(s): ${from} → ${to}`)

    let ok = 0
    let failed = 0

    for (const rawId of ids) {
        const id = rawId.replace(/^drafts\./, '')
        try {
            const doc = await source.getDocument(id)
            if (!doc) {
                console.warn(`⚠ skip ${id}: not found in "${from}"`)
                continue
            }
            await target.createOrReplace({ ...doc, _id: id })
            console.log(`✓ ${id} (${doc._type})`)
            ok++
        } catch (err) {
            console.error(`✗ ${id}:`, err instanceof Error ? err.message : err)
            failed++
        }
    }

    console.log(`\nDone. ${ok} synced, ${failed} failed.`)
    process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
