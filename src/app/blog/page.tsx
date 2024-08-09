import { Metadata } from 'next'
import { sanityFetch } from '@sanity/utils/fetch'
import { pageMetadataQuery, pageQuery } from '@sanity/utils/requests'
import { PAGE } from '@sanity/utils/types'
import HasBackgroundWrapper from '@components/common/HasBackgroundWrapper'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import SanityCtaGroup from '@components/common/molecules/SanityCtaGroup'
import CategoryPosts from '@components/common/organisms/posts/CategoryPosts'
import FeaturedPosts from '@components/common/organisms/posts/FeaturedPosts'
import PostList from '@components/common/organisms/posts/PostList'
import TalkToUs from '@components/new/TalkToUs'

export const revalidate = 60 // 1 minute

export async function generateMetadata(): Promise<Metadata> {
    const blogPage = await sanityFetch<PAGE>({
        query: pageMetadataQuery,
        params: { slug: 'blogs' },
    })

    return {
        title: blogPage?.seoTitle ?? 'Aesops - Blog',
        description:
            blogPage?.seoDescription ??
            'Dive deep into the world of data analysis, visualization, and insights. Whether you’re a seasoned data scientist or just beginning your journey in the field, our blog is your go-to resource for all things data.',
        openGraph: {
            title: blogPage?.seoTitle,
            description: blogPage?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${blogPage?.slug?.current}`,
        },
    }
}

async function Blog({ searchParams }) {
    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        params: { slug: 'blogs' },
    })

    return (
        <div className='max-w-screen-2xl mx-auto my-6 space-y-10 px-6 lg:space-y-16 lg:my-12'>
            <div className='space-y-6 px-5 lg:px-0'>
                <IntroSection sectionContent={page?.sections[0]} />
                <FeaturedPosts
                    featuredPosts={page?.sections[0].featuredPosts ?? []}
                />
            </div>

            <hr className='border border-gray-100 max-w-3xl' />

            <ContributionSection sectionContent={page?.sections[1]} />
            <hr className='border border-gray-100 max-w-3xl' />

            <CategoryPosts
                search={searchParams?.category}
                sectionContent={page?.sections[2]}
            />

            <hr className='border border-gray-100 max-w-3xl' />
            <div className='px-5 xl:px-0 space-y-20'>
                <PostList />
            </div>
            <TalkToUs />
        </div>
    )
}

function IntroSection({ sectionContent }) {
    return (
        <div className='max-w-2xl space-y-3 '>
            <Heading type='h1'>{sectionContent?.title}</Heading>
            <Text>{sectionContent?.description}</Text>
        </div>
    )
}

function ContributionSection({ sectionContent }) {
    return (
        <div className='relative h-full py-8 md:py-24'>
            <HasBackgroundWrapper className=' h-auto max-w-4xl flex items-center mx-auto lg:rounded-3xl'>
                <div className='max-w-xl px-5 py-24 mx-auto space-y-4 md:p-10 md:px-10'>
                    <Heading type='h1' className='text-brandaccent-50'>
                        {sectionContent?.title}
                    </Heading>
                    <Text className='text-brandaccent-50'>
                        {sectionContent?.description}
                    </Text>
                    <SanityCtaGroup ctas={sectionContent?.cta ?? []} />
                </div>
            </HasBackgroundWrapper>
        </div>
    )
}
export default Blog
