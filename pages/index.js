import Layout from '@/src/components/common/Layout'
import About from '@/src/components/home/About'
import Hero from '@/src/components/home/Hero'
import Offers from '@/src/components/home/Offers'
import WhatWeOffer from '@/src/components/home/WhatWeOffer'

function Home({ cookieConsent }) {
    return (
        <Layout title='Aesops - Home' cookieConsent={cookieConsent}>
            <Hero />
            <WhatWeOffer />
            <About />
            <Offers />
        </Layout>
    )
}

Home.getInitialProps = async (ctx) => {
    const cookieConsent = ctx.req ? ctx.req.cookies.cookieConsent : null

    return {
        cookieConsent,
    }
}

export default Home
