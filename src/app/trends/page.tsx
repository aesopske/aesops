import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ListWrapper from '@src/components/common/ListWrapper'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import AuthorCard from '@src/components/common/organisms/author-card/AuthorCard'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { featuredTrendsQuery } from '@sanity/utils/requests'
import { TREND } from '@sanity/utils/types'

async function TrendsPage({ searchParams }) {
    const featuredTrends = await sanityFetch<TREND[]>({
        query: featuredTrendsQuery,
    })

    return (
        <div className='min-h-screen'>
            <div className='max-w-md lg:max-w-screen-2xl mx-auto space-y-12 px-5 py-5 xl:px-0 w-full'>
                <div className='space-y-6'>
                    <div className='max-w-lg space-y-3'>
                        <Heading className='max-w-xl'>Featured Trends</Heading>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Unde labore amet nam nesciunt quod molestias
                            et possimus perferendis sequi repellendus.
                        </Text>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                        <ListWrapper
                            list={featuredTrends}
                            keyExtractor={(trend) => trend?.title}>
                            {(trend) => (
                                <div className='h-auto bg-white shadow-sm rounded-md overflow-hidden'>
                                    <div className='h-full w-full'>
                                        <Image
                                            src={urlForImage(trend?.image)}
                                            width={400}
                                            height={400}
                                            alt={trend?.image?.alt}
                                            className='w-full h-56 object-cover'
                                        />
                                        <Link
                                            href={`/trends/${trend?.slug?.current}`}
                                            passHref
                                            className=''>
                                            <div className='h-auto p-4 group space-y-3'>
                                                <Heading
                                                    type='h3'
                                                    className='text-primary-500 font-bold group-hover:underline underline-offset-4 decoration-dotted'>
                                                    {trend?.title}
                                                </Heading>
                                                <AuthorCard
                                                    isSmall
                                                    author={trend?.author}
                                                    date={new Date(
                                                        trend?._createdAt,
                                                    ).toDateString()}
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </ListWrapper>
                    </div>
                </div>
                {/*
                <div className='space-y-4 mt-5'>
                    <Heading type='h2'>Find your trending topics </Heading>
                    <Text className='max-w-lg'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Unde labore amet nam nesciunt quod molestias et possimus
                        perferendis sequi repellendus.
                    </Text>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                       <ListWrapper
                           list={trends}
                           keyExtractor={(item) => item}>
                           {(item, index) => (
                               <Link href='/trends/oilprices' passHref>
                                   <div className='h-64 bg-brandaccent-100 rounded-md flex items-center justify-center '>
                                       <Text className='text-primary-500 font-bold'>
                                           Trend {index + 1}
                                       </Text>
                                   </div>
                               </Link>
                           )}
                       </ListWrapper>
                    </div>
                </div>
                       */}
            </div>
        </div>
    )
}

export default TrendsPage
