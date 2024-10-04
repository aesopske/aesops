import React, { Suspense } from 'react'
import Image from 'next/image'
import ContentReader from '@src/components/common/ContentReader'
import Heading from '@src/components/common/atoms/Heading'
import AuthorCard from '@src/components/common/organisms/author-card/AuthorCard'
import BreadCrumbs from '@src/components/common/organisms/bread-crumbs/BreadCrumbs'
import VisualizationSelector from '@src/components/organisms/VisualizationSelector'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { trendQuery } from '@sanity/utils/requests'
import { TREND } from '@sanity/utils/types'

async function TrendsPage({ params }) {
    const trend = await sanityFetch<TREND>({
        query: trendQuery,
        params: { slug: params?.slug },
    })

    return (
        <div className='min-h-screen md:py-10'>
            <div className='relative w-full bg-brandaccent-50 overflow-hidden md:max-w-screen-2xl md:mx-auto lg:rounded-lg lg:h-96 2xl:px-0'>
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
            <div className='px-4 space-y-5 max-w-screen-2xl mx-auto py-10 2xl:px-0'>
                <div className='space-y-4'>
                    <div className='max-w-2xl'>
                        <ContentReader content={trend?.description} />
                    </div>

                    {trend?.endpoint ? (
                        <Suspense
                            fallback={<div>Preparing the dashboard...</div>}>
                            <VisualizationSelector
                                endpoint={trend?.endpoint}
                                project={trend?.slug.current}
                            />
                        </Suspense>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default TrendsPage
