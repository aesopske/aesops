import Layout from '@/src/components/common/Layout'
import About from '@/src/components/home/About'
import Hero from '@/src/components/home/Hero'
import Offers from '@/src/components/home/Offers'
import WhatWeOffer from '@/src/components/home/WhatWeOffer'

function Home() {
    return (
        <Layout title='Aesops - Home'>
            <Hero />
            <WhatWeOffer />
            <About />
            <Offers />
        </Layout>
    )
}

export default Home
