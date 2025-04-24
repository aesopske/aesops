import React, { Fragment } from 'react'
import { ResolvingMetadata, Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import ListWrapper from '@src/components/common/ListWrapper'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import Socials from '@src/components/common/organisms/author-card/Socials'
import BreadCrumbs from '@src/components/common/organisms/bread-crumbs/BreadCrumbs'
import PostCard from '@src/components/common/organisms/posts/PostCard'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
import { memberMetadataQuery, memberQuery } from '@sanity/utils/requests'
import { AUTHOR, POST } from '@sanity/utils/types'

export const revalidate = 86400 // 24 hours

type Props = {
    params: Promise<{ member: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { member } = await params
    const response = await sanityFetch<AUTHOR>({
        query: memberMetadataQuery,
        params: { slug: member },
    })
    const previousImages = (await parent).openGraph?.images ?? []
    return {
        title: response?.name,
        description: response?.bio,
        openGraph: {
            title: response?.name,
            description: response?.bio,
            images: [
                {
                    url: response?.image ? urlForImage(response?.image) : '',
                    alt: response?.image?.alt ?? '',
                },
                ...previousImages,
            ],
        },
    }
}

async function MemberPage({ params }: { params: Promise<{ member: string }> }) {
    const member = (await params).member
    const { isEnabled } = await draftMode()
    const memberData = await sanityFetch<AUTHOR>({
        query: memberQuery,
        params: { slug: member },
        draftMode: isEnabled,
    })

    const imageUrl = memberData?.image ? urlForImage(memberData?.image) : ''

    return (
        <div className='min-h-screen w-full'>
            <HasBackgroundWrapper className='h-auto min-h-48 lg:min-h-72'>
                <div className='max-w-screen-2xl mx-auto px-6  py-10 min-h-48 lg:min-h-72 flex flex-col gap-3 justify-end items-center 2xl:items-start 3xl:px-6'>
                    <div className='lg:hidden'>
                        <div className='w-36 h-36 rounded-full bg-gradient-to-br from-brandprimary-700  via-brandaccent-50 to-brandaccent-500 overflow-auto p-4 '>
                            <div className='h-full w-full'>
                                <Image
                                    src={imageUrl}
                                    alt={memberData?.name}
                                    width={400}
                                    height={400}
                                    className='object-cover p-[2px] rounded-full h-full w-full'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='gap-1 flex flex-col justify-center items-center 2xl:items-start xl:pt-20 3xl:pt-0'>
                        <BreadCrumbs color='light' />
                        <Heading className='text-brandaccent-50 max-w-xl xl:text-5xl'>
                            {memberData?.name}
                        </Heading>
                        {memberData?.isCoreMember && (
                            <div className='flex items-center gap-1 text-gray-100'>
                                <Role role={memberData?.role ?? ''} />
                            </div>
                        )}
                        <div className='my-3'>
                            <Socials
                                socials={memberData?.socials ?? []}
                                linkClassName='border-brandaccent-50 hover:border-brandaccent-100 text-brandaccent-50 hover:text-brandaccent-100 hover:bg-brandaccent-50/10  rounded-full'
                            />
                        </div>
                    </div>
                </div>
            </HasBackgroundWrapper>
            <div className='max-w-screen-2xl mx-auto px-4 2xl:px-0'>
                <div className='space-y-10 py-6 lg:py-24'>
                    <div className='space-y-4 flex flex-col items-center justify-start gap-10 lg:flex-row'>
                        <div className='hidden w-64 h-64 rounded-full bg-gradient-to-br from-brandprimary-700  via-brandaccent-50 to-brandaccent-500 overflow-auto p-4 lg:block'>
                            <div className='h-full w-full'>
                                <Image
                                    src={imageUrl}
                                    alt={memberData?.name}
                                    width={400}
                                    height={400}
                                    className='object-cover object-top p-4 rounded-full h-full w-full'
                                />
                            </div>
                        </div>

                        <Text className=' leading-relaxed max-w-4xl md:pt-20 lg:w-3/4 lg:text-left lg:pt-0 '>
                            {memberData?.bio}
                        </Text>
                    </div>

                    <div className='space-y-6'>
                        <Heading type='h4'>Posts by {memberData?.name}</Heading>
                        <hr className='border-gray-200 my-4' />
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-5 '>
                            {!memberData?.posts?.length && (
                                <Text>No posts available yet!!</Text>
                            )}
                            <ListWrapper
                                list={memberData?.posts ?? []}
                                itemKey='_id'>
                                {(post: POST) => (
                                    <PostCard post={post} hideAuthor />
                                )}
                            </ListWrapper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Role({ role }: { role: string }) {
    // check if split role is an array
    if (!role) return null

    const splitRole = role.split('|')

    return Array.isArray(splitRole) ? (
        <Text as='span' className='text-base text-current'>
            {splitRole.map((role: string, idx: number) => (
                <Fragment key={role}>
                    {role}{' '}
                    {idx < splitRole.length - 1 ? <span>&bull;</span> : ''}
                </Fragment>
            ))}
        </Text>
    ) : (
        <Text as='span' className='text-base text-current'>
            {role}
        </Text>
    )
}

export default MemberPage
