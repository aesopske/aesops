import React from 'react'
import { ResolvingMetadata, Metadata } from 'next'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContentReader from '@src/components/common/ContentReader'
import Heading from '@src/components/common/atoms/Heading'
import AuthorCard from '@src/components/common/organisms/author-card/AuthorCard'
import BreadCrumbs from '@src/components/common/organisms/bread-crumbs/BreadCrumbs'
import VisualizationSelector from '@src/components/organisms/VisualizationSelector'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { trendQuery, trendsQuery } from '@sanity/utils/requests'
import { PROJECT } from '@sanity/utils/types'

type Props = {
    params: {
        slug: string
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const page = await sanityFetch<PROJECT>({
        query: trendQuery,
        params: { slug: params?.slug },
    })
    const previousImages = (await parent).openGraph?.images ?? []
    return {
        title: page?.title ?? '',
        description: page?.title,
        openGraph: {
            title: page?.title,
            description: page?.title,
            images: [
                {
                    url: page?.image ? urlForImage(page?.image) : '',
                    alt: page?.image?.alt ?? '',
                },
                ...previousImages,
            ],
            authors: page?.author?.map((author) => author.name) ?? [],
            publishedTime: page?.publishedAt,
        },
    }
}

export async function generateStaticParams() {
    const posts = await sanityFetch<PROJECT[]>({
        stega: false,
        query: trendsQuery,
        perspective: 'published',
    })

    return posts.map((post) => ({
        slug: post.slug?.current,
    }))
}

async function DataDigestItem({ params }) {
    const trend = await sanityFetch<PROJECT>({
        query: trendQuery,
        params: { slug: params?.slug },
    })

    return (
        <div className='min-h-screen xl:py-10'>
            <div className='relative w-full bg-brandaccent-50 overflow-hidden md:max-w-screen-xl 2xl:max-w-screen-2xl md:mx-auto xl:rounded-lg h-72 lg:h-96 2xl:px-0'>
                <Image
                    src={urlForImage(trend?.image) ?? ''}
                    alt={trend?.image.alt}
                    width={1920}
                    height={1080}
                    unoptimized
                    className='object-cover w-full h-full object-center-center'
                />
                <div className='bg-gradient-to-b from-transparent via-black/40 to-black/90 absolute top-0 w-full h-full flex flex-col justify-end p-6'>
                    <div className='space-y-4 max-w-2xl'>
                        <BreadCrumbs color='light' />
                        <Heading type='h2' className='text-white'>
                            {trend?.title}
                        </Heading>
                        <AuthorCard
                            isSmall
                            author={trend?.author}
                            date={new Date(trend?._createdAt).toDateString()}
                            className='text-white'
                        />
                    </div>
                </div>
            </div>
            <div className='px-4 space-y-4 max-w-screen-xl mx-auto py-10 2xl:px-0 2xl:max-w-screen-2xl'>
                <Tabs defaultValue='overview' className='w-full rounded-md'>
                    <TabsList className='bg-brandaccent-50/80 py-6 px-2 rounded-full shadow-sm gap-4'>
                        <TabsTrigger
                            value='overview'
                            className='capitalize data-[state=active]:bg-brandprimary-900 data-[state=active]:text-brandaccent-50 text-sm font-sans font-normal text-gray-900 rounded-full hover:bg-brandaccent-100/50'>
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value='about'
                            className='capitalize data-[state=active]:bg-brandprimary-900 data-[state=active]:text-brandaccent-50 text-sm font-sans-sans font-normal text-gray-900 hover:bg-brandaccent-100/50 rounded-full'>
                            About the Topic
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value='overview'
                        aria-disabled={!trend?.endpoint}
                        className='py-4 '>
                        {trend?.endpoint ? (
                            <VisualizationSelector
                                endpoint={trend?.endpoint}
                                project={trend?.slug.current}
                            />
                        ) : null}
                    </TabsContent>
                    <TabsContent value='about' className='py-4'>
                        <div className='max-w-xl w-full'>
                            <ContentReader content={trend?.description} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default DataDigestItem
