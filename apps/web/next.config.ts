import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_API_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        SITE_URL: process.env.SITE_URL,
        SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
        HUGGING_FACE_ACCESS_TOKEN: process.env.HUGGING_FACE_ACCESS_TOKEN,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
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
}

export default nextConfig
