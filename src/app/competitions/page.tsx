import { SignedIn, SignedOut } from '@clerk/nextjs'
import { draftMode } from '@node_modules/next/headers'
import { Metadata } from 'next'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import ListWrapper from '@src/components/common/ListWrapper'
import Search from '@src/components/common/Search'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import AuthNav from '@src/components/common/organisms/auth-nav/AuthNav'
import CompetitionCard from '@src/components/common/organisms/competition-card/CompetitionCard'
import CompetitionProfile from '@src/components/common/organisms/competition-profile/CompetitionProfile'
import { cn } from '@src/lib/utils'
import { sanityFetch } from '@sanity/utils/fetch'
import {
    competitionsQuery,
    pageMetadataQuery,
    pageQuery,
} from '@sanity/utils/requests'
import { COMPETITION, PAGE } from '@sanity/utils/types'

export const revalidate = 60 // 60 seconds

export async function generateMetadata(): Promise<Metadata> {
    const blogPage = await sanityFetch<PAGE>({
        query: pageMetadataQuery,
        params: { slug: 'blogs' },
    })

    return {
        title: blogPage?.seoTitle ?? 'Aesops - Competitions',
        description: blogPage?.seoDescription,
        openGraph: {
            title: blogPage?.seoTitle,
            description: blogPage?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${blogPage?.slug?.current}`,
        },
    }
}

async function Competitions({ searchParams }) {
    const { search } = await searchParams
    const { isEnabled } = await draftMode()
    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        draftMode: isEnabled,
        params: { slug: 'competitions' },
    })

    const initialSection = page?.sections?.[0]

    const params = {
        limit: 8,
        search: search ?? '',
    }

    const competitions = await sanityFetch<COMPETITION[]>({
        query: competitionsQuery,
        params: search ? params : {},
    })

    return (
        <div className='min-h-screen'>
            <HasBackgroundWrapper className='h-72 relative'>
                <div className='flex flex-col gap-2  justify-center items-center h-full'>
                    <Heading className='font-bold text-white lg:text-5xl'>
                        {initialSection?.title}
                    </Heading>
                    <Text className='text-brandaccent-50'>
                        {initialSection?.description}
                    </Text>
                </div>
                <div className='absolute -bottom-5 -translate-x-1/2 left-1/2  bg-white max-w-lg h-14 shadow-md rounded-lg w-full mx-auto flex gap-2 py-1 px-2'>
                    <Search
                        label='Competitions search'
                        placeholder='Search competitions ...'
                        search={search}
                    />
                </div>
            </HasBackgroundWrapper>
            <div className='my-20 max-w-screen-2xl mx-auto h-full space-y-6'>
                <div className='bg-brandaccent-50 min-h-20 p-5 rounded-md'>
                    <SignedOut>
                        <div className='w-full flex items-center justify-between'>
                            <div>
                                <Heading type='h3' className='font-bold'>
                                    Start Competing Today
                                </Heading>
                                <Text className='w-auto'>
                                    Sign in to participate in competitions
                                </Text>
                            </div>
                            <AuthNav />
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <CompetitionProfile />
                    </SignedIn>
                </div>

                {search ? (
                    <div className='space-y-4'>
                        <Heading type='h3' className='font-bold'>
                            Search Results
                        </Heading>
                        <hr />
                        <div
                            className={cn('grid grid-cols-4 gap-4', {
                                'grid-cols-1': search,
                            })}>
                            <ListWrapper
                                list={[]}
                                itemKey='_id'
                                renderFallback={() => (
                                    <Text className='opacity-60'>
                                        Could not find what you&apos;re looking
                                        for, change your search
                                    </Text>
                                )}>
                                {(competition) => (
                                    <CompetitionCard
                                        competition={competition}
                                    />
                                )}
                            </ListWrapper>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-10'>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <Heading type='h3' className='font-bold'>
                                    Upcoming
                                </Heading>
                                <Text className='text-sm'>
                                    Compete with other players and win prizes
                                </Text>
                            </div>
                            <div className='grid grid-cols-4 gap-4'>
                                <ListWrapper list={competitions} itemKey='_id'>
                                    {(competition) => (
                                        <CompetitionCard
                                            competition={competition}
                                        />
                                    )}
                                </ListWrapper>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <Heading type='h3' className='font-bold'>
                                    All Competitions
                                </Heading>
                                <Text className='text-sm'>
                                    Compete with other players and win prizes
                                </Text>
                            </div>
                            <div className='grid grid-cols-4 gap-4'>
                                {competitions.map((competition, index) => (
                                    <CompetitionCard
                                        key={index}
                                        competition={competition}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Competitions
