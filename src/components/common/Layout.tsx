import Script from 'next/script'
import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { OpenGraphMedia } from 'next-seo/lib/types'
import { ErrorBoundary } from 'react-error-boundary'

import Navbar from './Navbar'
import Footer from './Footer'
import ScrollUp from './ScrollUp'
import CookieBanner from './CookieBanner'
import NavbarMobile from './NavbarMobile'
import ErrorHandler from './ErrorHandler'
import { useCookie } from '@/context/CookieProvider'
import useEventListener from '@/hooks/useEventListener'

type LayoutProps = {
    children: React.ReactNode
    title?: string
    description?: string
    keywords?: string
    url?: string
    imageurl?: OpenGraphMedia | string
    isArticle?: boolean
    ogarticleProps?: {
        publishedTime?: string
        modifiedTime?: string
        expirationTime?: string
        section?: string
        authors?: string[]
        tags?: string[]
    }
}

function Layout({
    children,
    title,
    keywords,
    description,
    url,
    imageurl,
    isArticle,
    ogarticleProps,
}: LayoutProps) {
    const { showCookieBanner } = useCookie()
    const [scroll, setScroll] = useState(false)

    const handleScrollChange = () => {
        if (window.scrollY !== 0) {
            setScroll(true)
        } else {
            setScroll(false)
        }
    }

    useEventListener('scroll', handleScrollChange)

    const openGraphImage = imageurl as OpenGraphMedia

    return (
        <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            width='100%'
            position='relative'>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url,
                    title,
                    description,
                    images: [openGraphImage],
                    type: isArticle ? 'article' : 'website',
                    article: isArticle ? ogarticleProps : {},
                }}
                twitter={{
                    site: url,
                    handle: '@Aesopsk',
                    cardType: 'summary_large_image',
                }}
                facebook={{
                    appId: '2559798124066192',
                }}
                additionalMetaTags={[
                    {
                        property: 'keywords',
                        content: keywords,
                    },
                    {
                        property: 'og:image',
                        content: imageurl as string,
                    },
                    {
                        property: 'twitter:image',
                        content: imageurl as string,
                    },
                ]}
            />
            <Script
                strategy='afterInteractive'
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
            />
            <Script
                id='gtm'
                strategy='afterInteractive'
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />

            <Navbar />

            <Box width='100%' height='auto'>
                {showCookieBanner && <CookieBanner />}
                <ErrorBoundary FallbackComponent={ErrorHandler}>
                    {children}
                </ErrorBoundary>
            </Box>
            <Footer />
            <ScrollUp scroll={scroll} />
            <NavbarMobile />
        </Box>
    )
}

Layout.defaultProps = {
    title: 'Aesops',
    description:
        'A data company, with a vision to be the best at providing all things data in Kenya and help come up with solutions to problems based on this data. By creating a network and community of datascientists, we are able to provide insight, information and data to solve problems, as welll as to enrich our audience with the knowledge of data.',
    keywords:
        'Aesops, Aesopske, Aesops ke, Aesops fables, Aesops company, Aesop, Kenyan Data, data, kenya bureau of statistics, data from kenya, statistics, data science, zindi competitions, data analytics kenya, datasets, search kenya data, kaggle for kenya, like kaggle Kenya, like zindi, similar to kaggle, Data consultancy, where to start in kenyan data',
    url: 'https://aesops.co.ke',
    imageurl:
        'https://firebasestorage.googleapis.com/v0/b/aesops-ke.appspot.com/o/aesops-seo.png?alt=media&token=33e1fc5e-68cb-435f-9d1e-466bd0ad5dd6',
    isArticle: false,
    ogarticleProps: {},
}

export default Layout
