import { Metadata, ResolvingMetadata } from 'next'
import Hero from '@/components/common/Hero'
import Consultancy from '@/components/new/Consultancy'
import Datasets from '@/components/new/Datasets'
import RecentPosts from '@/components/new/RecentPosts'
// import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
// import Heading from '@src/components/common/atoms/Heading'
// import Text from '@src/components/common/atoms/Text'
import Community from '@src/components/new/Community'
import TalkToUs from '@src/components/new/TalkToUs'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { pageMetadataQuery, pageQuery } from '@sanity/utils/requests'
import { PAGE } from '@sanity/utils/types'

type Props = {}

export async function generateMetadata(
    _: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const page = await sanityFetch<PAGE>({
        query: pageMetadataQuery,
        params: { slug: 'home-page' },
    })

    const previousImages = (await parent).openGraph?.images || []
    const pageOgImage = page?.ogimage ? urlForImage(page.ogimage) : ''

    return {
        title: page?.seoTitle ?? 'Aesops - Unveiling Insights',
        description:
            page?.seoDescription ??
            'Are you looking to get insights for your data and make data-driven decisions? Aesops is a pioneering data organisation based in Kenya, dedicated to revolutionising the data sector in the country. AESOPS has rapidly evolved into a dynamic platform that collects, curates, and disseminates data, fostering a culture of data-driven decision-making and innovation.',
        openGraph: {
            title: page?.seoTitle,
            description: page?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
            images: [pageOgImage, ...previousImages],
        },
    }
}

async function Page() {
    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        params: { slug: 'home-page' },
    })

    return (
        <div className='w-full h-full min-h-screen'>
            <Hero section={page?.sections[0]} />
            <Datasets section={page?.sections[1]} />
            <Consultancy section={page?.sections[2]} />
            <Community section={page?.sections[3]} />
            {/* <div className='relative h-full py-20 my-10'>
                <HasBackgroundWrapper className=' h-auto max-w-4xl flex items-center mx-auto md:rounded-3xl'>
                    <div className='max-w-lg mx-auto space-y-4 p-10 md:py-28'>
                        <Heading
                            type='h2'
                            className='text-brandaccent-50 text-2xl'>
                            What our clients say.
                        </Heading>
                        <Text className='text-brandaccent-50'>
                            &quot;Aesop has been a great partner in helping us
                            understand our data. Their team of experts have
                            provided us with actionable insights that have
                            helped us make informed decisions.&quot;
                        </Text>
                        <Text className='text-brandaccent-50 font-bold'>
                            John Doe, CEO, Aesops Ltd
                        </Text>
                    </div>
                </HasBackgroundWrapper>
            </div> */}
            <RecentPosts className='px-5 xl:px-0' />
            <div className='md:px-6 2xl:px-0'>
                <TalkToUs />
            </div>
        </div>
    )
}

export default Page
