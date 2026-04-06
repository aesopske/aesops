import mailchimp from '@mailchimp/mailchimp_marketing'

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_SERVER,
})

// Ping function
export const ping = async () => {
    const response = mailchimp.ping.get()
    return response
}
