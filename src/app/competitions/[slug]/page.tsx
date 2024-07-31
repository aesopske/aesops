import { SignInButton } from '@clerk/nextjs'
import { format } from 'date-fns'
import React from 'react'
import { ResolvingMetadata, Metadata } from 'next'
import { QueryParams } from 'next-sanity'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContentReader from '@src/components/common/ContentReader'
import ListWrapper from '@src/components/common/ListWrapper'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import BreadCrumbs from '@src/components/common/organisms/bread-crumbs/BreadCrumbs'
import ClerkWrapper from '@src/components/common/organisms/clerk-wrapper/ClerkWrapper'
import { Button } from '@src/components/ui'
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
        // naviqate to 404
        notFound()
    }

    const imageUrl = competition?.mainImage
        ? urlForImage(competition?.mainImage)
        : ''

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
                <div className='space-y-4'>
                    <BreadCrumbs />
                    <div className='space-y-2'>
                        <div className='flex flex-col items-start justify-between gap-2 lg:flex-row'>
                            <Heading className='lg:text-5xl'>
                                {competition?.title}
                            </Heading>
                            <div>
                                <ClerkWrapper
                                    renderSignedIn={() => (
                                        <div>
                                            <Button
                                                variant='dark'
                                                className='rounded-full'>
                                                Join Competition
                                            </Button>
                                        </div>
                                    )}
                                    renderSignedOut={() => (
                                        <div>
                                            <SignInButton>
                                                <Button
                                                    variant='dark'
                                                    className='rounded-full'>
                                                    Sign In to Join
                                                </Button>
                                            </SignInButton>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            {competition?.endDate ? (
                                <Text className='text-base'>
                                    Ends &bull;{' '}
                                    {format(
                                        competition?.endDate,
                                        'dd MMM yyyy',
                                    )}
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
                </div>

                <Text className='text-base max-w-xl'>
                    {competition?.description}
                </Text>

                <hr className='my-4' />
                <div>
                    <Tabs
                        defaultValue={competition?.tabs?.[0]?.title.toLowerCase()}
                        className='w-full max-w-3xl rounded-md'>
                        <TabsList className='bg-brandaccent-50/80 py-6 px-2 rounded-full shadow-sm'>
                            <ListWrapper list={competition.tabs ?? []}>
                                {(item) => (
                                    <TabsTrigger
                                        value={item.title.toLowerCase()}
                                        className='capitalize data-[state=active]:bg-brandprimary-900 data-[state=active]:text-brandaccent-50 text-base font-normal text-gray-900 data-[state=active]:rounded-full'>
                                        {item.title}
                                    </TabsTrigger>
                                )}
                            </ListWrapper>
                        </TabsList>
                        <ListWrapper list={competition?.tabs ?? []}>
                            {(item) => (
                                <TabsContent
                                    value={item.title.toLowerCase()}
                                    className='py-8 bg-brandaccent-50/50 rounded-lg px-6 shadow-sm'>
                                    <div className='space-y-4'>
                                        <ContentReader content={item.content} />
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
