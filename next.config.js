module.exports = {
    reactStrictMode: true,
    env: {
        BASE_URL: process.env.BASE_API_URL,
        DASHBOARD_URL: process.env.DASHBOARD_URL,
        trackingId: process.env.GA_TRACKING_ID,
        SITE_URL: process.env.SITE_URL,
    },
}
