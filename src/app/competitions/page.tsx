import { format } from 'date-fns'
import { Metadata } from 'next'
import Image from 'next/image'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import ListWrapper from '@src/components/common/ListWrapper'
import Search from '@src/components/common/Search'
import AesopLink from '@src/components/common/atoms/AesopLink'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import AuthNav from '@src/components/common/organisms/auth-nav/AuthNav'
import { sanityFetch } from '@sanity/utils/fetch'
import { urlForImage } from '@sanity/utils/image'
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
    const allCompetitions = Array.from({ length: 10 }, (_, i) => i + 1)

    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        params: {
            slug: 'competitions',
        },
    })

    const initialSection = page?.sections?.[0]

    const competitions = await sanityFetch<COMPETITION[]>({
        query: competitionsQuery,
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
                        search={searchParams.search}
                    />
                </div>
            </HasBackgroundWrapper>
            <div className='my-20 max-w-screen-2xl mx-auto h-full space-y-6'>
                <AuthNav />

                <div className='flex flex-col gap-2'>
                    <Heading type='h2' className='font-bold'>
                        Featured Competitions
                    </Heading>
                    <Text className='text-sm'>
                        Compete with other players and win prizes
                    </Text>
                    <div className='grid grid-cols-4 gap-4'>
                        {['1', '2', '3', '4'].map((_, index) => (
                            <div
                                key={index}
                                className='bg-white h-96 w-full rounded-md shadow-sm'></div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <Heading type='h2' className='font-bold'>
                        Upcoming
                    </Heading>
                    <Text className='text-sm'>
                        Compete with other players and win prizes
                    </Text>
                    <div className='grid grid-cols-4 gap-4'>
                        <ListWrapper list={competitions} itemKey='_id'>
                            {(competition: COMPETITION) => (
                                <CompetitionCard competition={competition} />
                            )}
                        </ListWrapper>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <Heading type='h2' className='font-bold'>
                        All Competitions
                    </Heading>
                    <Text className='text-sm'>
                        Compete with other players and win prizes
                    </Text>
                    <div className='grid grid-cols-4 gap-4'>
                        {allCompetitions.map((_, index) => (
                            <div
                                key={index}
                                className='bg-white h-96 w-full rounded-md shadow-sm'></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CompetitionCard({ competition }: { competition: COMPETITION }) {
    const imageUrl = urlForImage(competition.mainImage) ?? ''
    return (
        <div className='bg-white h-auto w-full rounded-md shadow-sm flex flex-col justify-between align-start overflow-hidden'>
            <div>
                <div className='h-48 w-full'>
                    <Image
                        src={imageUrl}
                        alt={competition?.mainImage?.alt ?? ''}
                        width={400}
                        height={400}
                        className='object-cover h-full w-full'
                    />
                </div>
                <div className='p-4 space-y-2'>
                    <Heading type='h4' className='font-bold'>
                        {competition.title}
                    </Heading>
                    <Text className='text-sm line-clamp-3'>
                        {competition.description}
                    </Text>
                </div>
                <div className='px-4 space-x-1'>
                    <Text as='span'>
                        {format(competition.startDate, 'dd MMM yyyy')}
                    </Text>
                    <Text as='span'>&bull;</Text>
                    <Text as='span'>
                        {competition.endDate
                            ? format(competition.endDate, 'dd MMM yyyy')
                            : 'Ongoing'}
                    </Text>
                </div>
            </div>

            <div className='p-4'>
                <AesopLink
                    href={`/competitions/${competition.slug?.current}`}
                    type='button'
                    variant='dark'>
                    Join Competition &rarr;
                </AesopLink>
            </div>
        </div>
    )
}

export default Competitions
