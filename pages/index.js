import Layout from '@/src/components/common/Layout'
import About from '@/src/components/home/About'
import DatasetsHero from '@/src/components/home/DatasetsHero'
import Hero from '@/src/components/home/Hero'
import MachineLearning from '@/src/components/home/MachineLearning'
import Projects from '@/src/components/home/Projects'
import VisualCode from '@/src/components/home/VisualCode'
import WhatWeOffer from '@/src/components/home/WhatWeOffer'

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
