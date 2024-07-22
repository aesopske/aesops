import { format } from 'date-fns'
import React from 'react'
import { ResolvingMetadata, Metadata } from 'next'
import { QueryParams } from 'next-sanity'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContentReader from '@src/components/common/ContentReader'
import ListWrapper from '@src/components/common/ListWrapper'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import { Badge } from '@src/components/ui/badge'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import {
    competitionQuery,
    competitionsMetadataQuery,
} from '@sanity/utils/requests'
import { COMPETITION } from '@sanity/utils/types'

type Props = {
    params: {
        slug: string
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const competition = await sanityFetch<COMPETITION>({
        query: competitionsMetadataQuery,
        params: { slug: params?.slug },
    })
    const previousImages = (await parent).openGraph?.images ?? []
    return {
        title: competition?.title,
        description: competition?.description,
        openGraph: {
            title: competition?.title,
            description: competition?.description,
            images: [
                {
                    url: competition?.mainImage
                        ? urlForImage(competition?.mainImage)
                        : '',
                    alt: competition?.mainImage?.alt ?? '',
                },
                ...previousImages,
            ],
        },
    }
}

async function page({ params }: { params: QueryParams }) {
    const slug = params?.slug

    if (!slug) return null

    const competition = await sanityFetch<COMPETITION>({
        query: competitionQuery,
        params: { slug },
    })

    if (!competition) {
        return null
    }

    const imageUrl = competition?.mainImage
        ? urlForImage(competition?.mainImage)
        : ''

    const infoArray = Object.keys(competition?.info ?? {}).filter(
        (item) => !item.startsWith('_'),
    )
    // custom sorting for the info array - [overview, dataset, prizes, rules]
    const sortedInfoArray = infoArray.reverse()

    return (
        <div className='min-h-screen'>
            <div className='h-96 w-full'>
                <Image
                    src={imageUrl}
                    alt={competition?.mainImage?.alt}
                    height={400}
                    width={1000}
                    className='object-cover w-full h-full'
                />
            </div>
            <div className='p-4 space-y-5 max-w-screen-2xl mx-auto py-10'>
                <div className='space-y-2'>
                    <Heading className='lg:text-5xl'>
                        {competition?.title}
                    </Heading>
                    <div className='flex gap-2 flex-wrap'>
                        {competition?.endDate ? (
                            <Text className='text-base'>
                                Ends &bull;{' '}
                                {format(competition?.endDate, 'dd MMM yyyy')}
                            </Text>
                        ) : (
                            <Badge className='text-sm rounded-full w-fit'>
                                Ongoing
                            </Badge>
                        )}
                        <Text className='text-base '>
                            Started &bull;{' '}
                            {format(competition?.startDate, 'dd MMM yyyy')}
                        </Text>
                    </div>
                </div>

                <Text className='text-base max-w-xl'>
                    {competition?.description}
                </Text>
                <hr className='my-4' />
                <div>
                    <Tabs
                        defaultValue='overview'
                        className='w-full max-w-3xl rounded-md'>
                        <TabsList className='bg-brandaccent-50/50 py-6 px-3 rounded-full'>
                            <ListWrapper list={sortedInfoArray}>
                                {(item) => (
                                    <TabsTrigger
                                        value={item}
                                        className='capitalize data-[state=active]:bg-brandprimary-900 data-[state=active]:text-brandaccent-50 text-base text-gray-900 data-[state=active]:rounded-full'>
                                        {item}
                                    </TabsTrigger>
                                )}
                            </ListWrapper>
                        </TabsList>
                        <ListWrapper list={sortedInfoArray}>
                            {(item) => (
                                <TabsContent
                                    value={item}
                                    className='py-8 bg-brandaccent-50/50 rounded-lg px-6 shadow-sm'>
                                    <div className='space-y-4'>
                                        <ContentReader
                                            content={competition?.info?.[item]}
                                        />
                                    </div>
                                </TabsContent>
                            )}
                        </ListWrapper>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default page
