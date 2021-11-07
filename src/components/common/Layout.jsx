import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import { useEffect, useState } from 'react'
import { useGa } from '@/src/context/TrackingProvider'
import ScrollUp from './ScrollUp'

function Layout({ children, title, keywords, description, url, imageurl }) {
    const [scroll, setScroll] = useState(false)
    const { pageView } = useGa()

    const handleScrollChange = () => {
        if (window.scrollY !== 0) {
            setScroll(true)
        } else {
            setScroll(false)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScrollChange)
        }

        return () => window.removeEventListener('scroll', handleScrollChange)
    }, [])

    useEffect(() => {
        pageView()
    }, [pageView])
    return (
        <Box width='100%'>
            <Head>
                <title>{title}</title>
                <meta title='description' content={description} />
                <meta title='keywords' content={keywords} />

                {/* Open Graph / facebook */}

                <meta property='og:type' content='website' />
                <meta property='og:url' content={url} />
                <meta property='og:title' content={title} />
                <meta property='og:description' content={description} />
                <meta property='og:image' content={imageurl} />

                {/* Twitter card */}
                <meta property='twitter:card' content='summary_large_image' />
                <meta property='twitter:url' content={url} />
                <meta property='twitter:title' content='Aesops' />
                <meta property='twitter:description' content={description} />
                <meta property='twitter:image' content={imageurl} />
            </Head>
            <Navbar />
            <Box width='100%' height='auto'>
                {children}
            </Box>
            <Footer />
            <ScrollUp scroll={scroll} />
        </Box>
    )
}

Layout.defaultProps = {
    title: 'Aesops',
    description:
        'A data company, with a vision to be the best at providing all things data in Kenya and help come up with solutions to problems based on this data. By creating a network and community of datascientists, we are able to provide insight, information and data to solve problems, as welll as to enrich our audience with the knowledge of data.',
    keywords:
        'Kenyan Data, data, kenya bureau of statistics, data from kenya, statistics, data science, zindi competitions, data analytics kenya, datasets, search kenya data, kaggle for kenya, like kaggle Kenya, like zindi, similar to kaggle',
    url: 'https://aesops.co.ke/',
    imageurl:
        'https://firebasestorage.googleapis.com/v0/b/aesops-ke.appspot.com/o/aesops-seo.png?alt=media&token=33e1fc5e-68cb-435f-9d1e-466bd0ad5dd6',
}

export default Layout
