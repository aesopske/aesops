import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import ContentHeadingReader from '@src/components/common/ContentHeadingReader'
import ContentReader from '@src/components/common/ContentReader'
import Heading from '@src/components/common/atoms/Heading'
import { sanityFetch } from '@sanity/utils/fetch'
import { pageMetadataQuery, pageQuery } from '@sanity/utils/requests'
import { PAGE, PAGE_METADATA } from '@sanity/utils/types'

export async function generateMetadata(): Promise<Metadata> {
    const meta = await sanityFetch<PAGE_METADATA>({
        query: pageMetadataQuery,
        params: { slug: 'blog-contribution-guide' },
    })

    return {
        title: meta?.seoTitle ?? 'Aesops - Blog Contribution Guide',
        description:
            meta?.seoDescription ??
            'Dive deep into the world of data analysis, visualization, and insights. Whether you’re a seasoned data scientist or just beginning your journey in the field, our blog is your go-to resource for all things data.',
        openGraph: {
            title: meta?.seoTitle,
            description: meta?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/contribute`,
        },
    }
}

async function Contribute() {
    const { isEnabled } = await draftMode()
    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        draftMode: isEnabled,
        params: { slug: 'blog-contribution-guide' },
    })

    const section = page?.sections[0] ?? null

    return (
        <div>
            <div className='min-h-[20vh] bg-brandprimary-700 flex items-center'>
                <div className='max-w-screen-2xl mx-auto flex items-center px-5 py-5 xl:px-0 w-full'>
                    <Heading className='text-brandaccent-50 max-w-xl'>
                        {section?.title}
                    </Heading>
                </div>
            </div>

            <div className='relative max-w-screen-xl mx-auto px-5 py-10 lg:py-20 xl:px-0 grid grid-cols-1 lg:grid-cols-3 gap-5'>
                <ContentHeadingReader
                    body={section?.descriptionContent}
                    className='sticky top-28 z-10 h-96 rounded lg:block'
                />

                <div className='space-y-5 lg:col-span-2'>
                    <ContentReader content={section?.descriptionContent} />
                </div>
            </div>
        </div>
    )
}

export default Contribute
