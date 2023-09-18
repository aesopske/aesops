import Layout from '@/components/common/Layout'
import About from '@/components/home/About'
import DatasetsHero from '@/components/home/DatasetsHero'
import Hero from '@/components/home/Hero'
import MachineLearning from '@/components/home/MachineLearning'
import Projects from '@/components/home/Projects'
import VisualCode from '@/components/home/VisualCode'
import WhatWeOffer from '@/components/home/WhatWeOffer'

function Home() {
    return (
        <Layout title='Aesops - Home'>
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



export default Home
