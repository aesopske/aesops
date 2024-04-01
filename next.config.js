/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_API_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        GA_TRACKING_ID: process.env.GA_TRACKING_ID,
        SITE_URL: process.env.SITE_URL,
        SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
        HAGGING_FACE_ACCESS_TOKEN: process.env.HAGGING_FACE_ACCESS_TOKEN,
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
        ],
    },
}

module.exports = nextConfig
