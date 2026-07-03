import 'server-only'
import { env } from '@/env'

export type QueryRow = Record<string, unknown>

// Runs SQL against the remote DuckDB executor (apps/duckdb-executor) — a
// native DuckDB instance on Vercel's Python runtime, reading Parquet directly
// off a signed URL via httpfs. Replaces the in-process @duckdb/duckdb-wasm
// instance, whose extension autoloader couldn't be made to work reliably in
// this Lambda sandbox (see dataset-diff.ts/dataset-tools.ts git history).
export async function runRemoteQuery(sql: string): Promise<QueryRow[]> {
    const res = await fetch(env.DUCKDB_EXECUTOR_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-executor-secret': env.DUCKDB_EXECUTOR_SECRET,
        },
        body: JSON.stringify({ sql }),
    })

    const body = (await res.json().catch(() => null)) as
        | { rows: QueryRow[] }
        | { error: string }
        | null

    if (!res.ok || !body || 'error' in body) {
        const message = body && 'error' in body ? body.error : `HTTP ${res.status}`
        throw new Error(`DuckDB executor query failed: ${message}`)
    }

    return body.rows
}

// SQL string literal escaping for embedding a URL directly in a
// read_parquet('...') reference — mirrors dataset-query.ts's lit().
export function sqlStringLiteral(value: string): string {
    return `'${value.replace(/'/g, "''")}'`
}
