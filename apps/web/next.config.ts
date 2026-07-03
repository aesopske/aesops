import { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

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
    outputFileTracingIncludes: {
        '/api/**/*': ['./node_modules/@duckdb/duckdb-wasm/dist/**'],
    },
}

export default withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
})
