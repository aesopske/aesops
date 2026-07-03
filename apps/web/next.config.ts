import { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

// Node-runtime files duckdb.ts actually loads: the blocking driver, its two
// worker threads, and their matching wasm binaries.
const duckdbNodeRuntimeFiles = [
    './node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-blocking.cjs',
    './node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-mvp.worker.cjs',
    './node_modules/@duckdb/duckdb-wasm/dist/duckdb-node-eh.worker.cjs',
    './node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm',
    './node_modules/@duckdb/duckdb-wasm/dist/duckdb-eh.wasm',
]

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
            },
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com',
            },
        ],
    },
    transpilePackages: ['@repo/ui'],
    // Keep DuckDB-WASM out of the bundle so its .wasm / worker files stay on
    // disk and require.resolve works at runtime (and they get traced for deploy).
    serverExternalPackages: ['@duckdb/duckdb-wasm'],
    // The dist path is resolved dynamically at runtime (duckdb.ts), so Next's
    // output file tracer can't see it statically — include it explicitly or
    // the .cjs/.wasm/.worker files are missing from the deployed Lambda.
    // Scoped to only the routes that use it, and to only the files duckdb.ts
    // actually loads — the rest of dist/ (browser bundles, coi.wasm,
    // sourcemaps, ~65MB) is deleted at build time by
    // scripts/prune-duckdb-wasm.mjs, since once any file in the package is
    // referenced here Next copies the whole package directory into each
    // Lambda regardless of this include list, and that copy step ignores
    // outputFileTracingExcludes.
    outputFileTracingIncludes: {
        '/api/datasets/[id]/diff/route': duckdbNodeRuntimeFiles,
        '/api/ai/chat/route': duckdbNodeRuntimeFiles,
        '/api/ai/comment-reply/route': duckdbNodeRuntimeFiles,
        '/api/download/[id]/route': duckdbNodeRuntimeFiles,
    },
}

export default withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
})
