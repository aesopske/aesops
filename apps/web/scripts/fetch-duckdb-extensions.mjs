// The Node build of duckdb-wasm doesn't statically bundle the `parquet`
// extension — it fetches it over the network on first use via DuckDB's
// extension autoload mechanism. That fetch reliably fails inside Vercel's
// Lambda sandbox (not a dead link — the URL itself is directly reachable;
// something about that environment's network path breaks it). Pre-downloading
// the extension at build time and pointing duckdb.ts's extension_directory at
// a local copy avoids any runtime network dependency entirely.
//
// The version segment in the URL (v1.5.4) is DuckDB's internal C++ engine
// version bundled inside @duckdb/duckdb-wasm, not the npm package version —
// it was read directly off a production "extension not available" error. If
// @duckdb/duckdb-wasm is upgraded and this starts 404ing, bump it to match.
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Buffer } from 'node:buffer'

const DUCKDB_ENGINE_VERSION = 'v1.5.4'
const PLATFORMS = ['wasm_eh', 'wasm_mvp']
const EXTENSIONS = ['parquet']

const outDir = path.join(process.cwd(), 'duckdb-extensions')

for (const platform of PLATFORMS) {
    for (const ext of EXTENSIONS) {
        const dir = path.join(outDir, DUCKDB_ENGINE_VERSION, platform)
        const file = path.join(dir, `${ext}.duckdb_extension.wasm`)
        if (existsSync(file)) continue

        const url = `https://extensions.duckdb.org/${DUCKDB_ENGINE_VERSION}/${platform}/${ext}.duckdb_extension.wasm`
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`)
        }
        mkdirSync(dir, { recursive: true })
        writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    }
}
