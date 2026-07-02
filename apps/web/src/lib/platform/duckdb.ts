import 'server-only'
import { createRequire } from 'node:module'
import path from 'node:path'
import * as duckdb from '@duckdb/duckdb-wasm/blocking'

// DuckDB-WASM (blocking Node build) — same engine as native DuckDB but shipped
// as a portable .wasm, so no native binary to bundle for serverless. The
// instance is memoized per server process; warm invocations skip instantiation.

// NOT named `require`: the bundler special-cases `require.resolve(...)` and would
// try to bundle the resolved file. A differently-named require anchored at cwd is
// left alone, so this resolves the real on-disk path at runtime.
const nodeRequire = createRequire(path.join(process.cwd(), 'noop.cjs'))

type DB = Awaited<ReturnType<typeof duckdb.createDuckDB>>
type Conn = ReturnType<DB['connect']>

export type QueryRow = Record<string, unknown>

let ready: Promise<{ db: DB; conn: Conn }> | null = null

function bundles() {
    // Resolve a .cjs in the dist dir (NOT the .wasm) so the bundler externalizes
    // it cleanly; the .wasm/worker paths below are plain runtime strings that the
    // bundler never treats as modules. NODE_RUNTIME reads them from disk at runtime.
    const dist = path.dirname(
        nodeRequire.resolve(
            '@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs',
        ),
    )
    return {
        mvp: {
            mainModule: path.join(dist, 'duckdb-mvp.wasm'),
            mainWorker: path.join(dist, 'duckdb-node-mvp.worker.cjs'),
        },
        eh: {
            mainModule: path.join(dist, 'duckdb-eh.wasm'),
            mainWorker: path.join(dist, 'duckdb-node-eh.worker.cjs'),
        },
    }
}

async function getConn() {
    if (!ready) {
        ready = (async () => {
            const db = await duckdb.createDuckDB(
                bundles(),
                new duckdb.VoidLogger(),
                duckdb.NODE_RUNTIME,
            )
            await db.instantiate()
            return { db, conn: db.connect() }
        })()
    }
    return ready
}

export type ParquetHandle = {
    /** Table reference to use in FROM clauses, e.g. read_parquet('…') */
    ref: string
    query: (sql: string) => QueryRow[]
    /** Drops the registered buffer; call once the request is done. */
    release: () => void
}

// Registers a Parquet buffer under a unique name so concurrent requests in the
// same process never collide. Queries run synchronously (single-threaded WASM),
// so they naturally serialize.
export async function registerParquet(
    buffer: Uint8Array,
): Promise<ParquetHandle> {
    const { db, conn } = await getConn()
    const name = `ds_${crypto.randomUUID()}.parquet`
    db.registerFileBuffer(name, buffer)
    return {
        ref: `read_parquet('${name}')`,
        query: (sql: string) =>
            conn
                .query(sql)
                .toArray()
                .map((r: Record<string, unknown>) => ({ ...r }) as QueryRow),
        release: () => {
            try {
                db.dropFile(name)
            } catch {
                /* already gone */
            }
        },
    }
}
