import { NextConfig } from 'next'

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
}

export default nextConfig
