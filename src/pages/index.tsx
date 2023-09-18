import Layout from '@/components/common/Layout'
import About from '@/components/home/About'
import DatasetsHero from '@/components/home/DatasetsHero'
import Hero from '@/components/home/Hero'
import MachineLearning from '@/components/home/MachineLearning'
import Projects from '@/components/home/Projects'
import VisualCode from '@/components/home/VisualCode'
import WhatWeOffer from '@/components/home/WhatWeOffer'

function Home({ cookieConsent }) {
    return (
        <Layout title='Aesops - Home' cookieConsent={cookieConsent}>
            <Hero />
            <WhatWeOffer />
            <About />
            <DatasetsHero />
            <Projects />
            <VisualCode />
            <MachineLearning />
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
