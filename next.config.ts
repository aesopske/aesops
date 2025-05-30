import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_API_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        GA_TRACKING_ID: process.env.GA_TRACKING_ID,
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
}

export default nextConfig
