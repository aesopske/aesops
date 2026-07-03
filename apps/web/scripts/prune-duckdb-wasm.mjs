// duckdb.ts only ever loads the Node "blocking" driver, its two worker
// threads, and their matching mvp/eh wasm binaries (see bundles() there).
// The rest of @duckdb/duckdb-wasm's dist/ — browser bundles, the coi wasm
// variant, sourcemaps, img/ — is unused at runtime but still gets copied
// wholesale into every API route's Lambda by Next's output tracing
// (outputFileTracingIncludes/Excludes don't prune this copy step). Deleting
// the unused ~65MB before `next build` runs keeps duckdb-touching routes
// under Vercel's 250MB uncompressed function size limit. `types/` and the
// .d.ts stub files are kept (negligible size, and the stubs reference
// types/ for their actual declarations).
import { rmSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const dist = path.dirname(require.resolve('@duckdb/duckdb-wasm/dist/duckdb-node.cjs'))

const unused = [
    'duckdb-browser-blocking.cjs',
    'duckdb-browser-blocking.cjs.map',
    'duckdb-browser-blocking.mjs',
    'duckdb-browser-blocking.mjs.map',
    'duckdb-browser-coi.pthread.worker.js',
    'duckdb-browser-coi.pthread.worker.js.map',
    'duckdb-browser-coi.worker.js',
    'duckdb-browser-coi.worker.js.map',
    'duckdb-browser-eh.worker.js',
    'duckdb-browser-eh.worker.js.map',
    'duckdb-browser-mvp.worker.js',
    'duckdb-browser.cjs',
    'duckdb-browser.cjs.map',
    'duckdb-browser.mjs',
    'duckdb-browser.mjs.map',
    'duckdb-coi.wasm',
    'duckdb-node-blocking.cjs.map',
    'duckdb-node-eh.worker.cjs.map',
    'duckdb-node-mvp.worker.cjs.map',
    'duckdb-node.cjs.map',
    'img',
]

for (const name of unused) {
    const target = path.join(dist, name)
    if (existsSync(target)) {
        rmSync(target, { recursive: true, force: true })
    }
}
