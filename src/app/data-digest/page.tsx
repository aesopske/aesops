import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { pageMetadataQuery, pageQuery } from '@sanity/utils/requests'
import { PAGE, PAGE_METADATA } from '@sanity/utils/types'
import ListWrapper from '@components/common/ListWrapper'
import AesopLink from '@components/common/atoms/AesopLink'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import AuthorCard from '@components/common/organisms/author-card/AuthorCard'

export const revalidate = 60 // 1 minute

export async function generateMetadata(): Promise<Metadata> {
    const page = await sanityFetch<PAGE_METADATA>({
        query: pageMetadataQuery,
        params: { slug: 'data-digest' },
    })

    return {
        title: page?.seoTitle ?? 'Data Digest',
        description:
            page?.seoDescription ??
            'Discover the latest data insights, trends, and analysis from the world of data science and analytics.',
        openGraph: {
            title: page?.seoTitle,
            description: page?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${page?.slug?.current}`,
            images: [
                {
                    width: 800,
                    height: 600,
                    alt: page?.ogimage?.alt,
                    url: page?.ogimage ? urlForImage(page?.ogimage) : '',
                },
            ],
        },
    }
}

async function DataDigestPage() {
    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        params: { slug: 'data-digest' },
    })

    return (
        <div className='min-h-screen'>
            <div className='max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) mx-auto space-y-12 px-5 py-5 xl:px-0 w-full'>
                <div className='space-y-6'>
                    <div className='max-w-lg space-y-3'>
                        <Heading type='h2'>{page?.sections[0]?.title}</Heading>
                        <Text>{page?.sections[0]?.description}</Text>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                        <ListWrapper
                            list={page?.sections[0]?.projects ?? []}
                            keyExtractor={(project) => project?.title}>
                            {(project) => (
                                <div className='h-auto bg-white shadow-xs rounded-md overflow-hidden md:odd:col-span-2'>
                                    <div className='h-full w-full space-y-4'>
                                        <Image
                                            src={urlForImage(project?.image)}
                                            width={400}
                                            height={400}
                                            alt={project?.image?.alt}
                                            className='w-full h-60 object-cover object-center'
                                        />

                                        <div className='h-auto p-2 px-4 space-y-2'>
                                            <Heading
                                                type='h4'
                                                className='text-primary-500 font-bold'>
                                                {project?.title}
                                            </Heading>
                                            <div className='flex flex-col gap-2 w-full items-start justify-between py-2 border-t border-gray-100 md:flex-row md:items-center'>
                                                <AuthorCard
                                                    isSmall
                                                    author={
                                                        project?.author ?? []
                                                    }
                                                    date={new Date(
                                                        project?._createdAt,
                                                    ).toDateString()}
                                                />
                                                <AesopLink
                                                    type='button'
                                                    variant='dark'
                                                    href={`/data-digest/${project?.slug?.current}`}>
                                                    Read More ...
                                                </AesopLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ListWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataDigestPage
