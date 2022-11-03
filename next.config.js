module.exports = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_API_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        GA_TRACKING_ID: process.env.GA_TRACKING_ID,
        SITE_URL: process.env.SITE_URL,

        // firebase storage bucket
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,

        // slack
        SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,

        // jwt
        JWT_SECRET: process.env.JWT_SECRET,

        // mongodb
        MONGO_URI: process.env.MONGO_URI,
    },
    images: {
        domains: ['res.cloudinary.com', 'firebasestorage.googleapis.com'],
    },
}
