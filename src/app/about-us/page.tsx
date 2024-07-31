import {
    BriefcaseBusiness,
    Focus,
    Footprints,
    Handshake,
    Rocket,
    ShieldCheck,
    Target,
} from 'lucide-react'
import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ListWrapper from '@src/components/common/ListWrapper'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'
import AboutMember from '@src/components/common/organisms/about-author/AboutAuthor'
import { Badge } from '@src/components/ui/badge'
import { sanityFetch } from '@sanity/utils/fetch'
import { formatAuthor } from '@sanity/utils/formatAuthor'
import { urlForImage } from '@sanity/utils/image'
import { pageMetadataQuery, pageQuery } from '@sanity/utils/requests'
import { AUTHOR, PAGE, SECTION, VALUE } from '@sanity/utils/types'

export async function generateMetadata(): Promise<Metadata> {
    const blogPage = await sanityFetch<PAGE>({
        query: pageMetadataQuery,
        params: { slug: 'about-us' },
    })

    return {
        title: blogPage?.seoTitle ?? 'Aesops - About Us',
        description: blogPage?.seoDescription,
        openGraph: {
            title: blogPage?.seoTitle,
            description: blogPage?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/${blogPage?.slug?.current}`,
        },
    }
}

async function AboutUs() {
    const page = await sanityFetch<PAGE>({
        query: pageQuery,
        params: { slug: 'about-us' },
    })
    return (
        <div className='min-h-screen'>
            <OurStory sectionContent={page?.sections[0]} />
            <OurMissionVision
                mission={page?.sections[1]}
                vision={page?.sections[2]}
            />
            <OurValues sectionContent={page?.sections[3]} />
            <OurTeam sectionContent={page?.sections[4]} />
        </div>
    )
}

function OurStory({ sectionContent }: { sectionContent: SECTION }) {
    const sectionImg = urlForImage(sectionContent?.image?.asset)
    return (
        <section
            id='about'
            className='min-h-96 bg-brandprimary-700 text-brandaccent-50'>
            <div className='max-w-screen-2xl px-6 grid grid-cols-1 md:grid-cols-2 col-span-2 mx-auto md:gap-4 h-full 2xl:px-0'>
                <div className='space-y-4 text-brandaccent-50 py-6 lg:py-24 '>
                    <Badge variant='secondary' className='rounded-full'>
                        Our Story
                    </Badge>
                    <Heading className='text-current'>
                        {sectionContent?.title}
                    </Heading>
                    <Text className='text-current font-light max-w-xl'>
                        {sectionContent?.description}
                    </Text>
                </div>
                <div className='py-6 h-60 w-full grid grid-cols-3 gap-4 md:h-72 lg:h-96 lg:gap-8'>
                    <div className='h-full rounded-full overflow-hidden '>
                        <Image
                            width={500}
                            height={500}
                            src={sectionImg}
                            alt={sectionContent?.image?.alt}
                            className='h-full w-full object-cover object-left scale-125'
                        />
                    </div>
                    <div className='h-full rounded-full overflow-hidden '>
                        <Image
                            src={sectionImg}
                            width={500}
                            height={500}
                            alt={sectionContent?.image?.alt}
                            className='h-full w-full object-cover object-center scale-125'
                        />
                    </div>
                    <div className='h-full rounded-full overflow-hidden'>
                        <Image
                            src={sectionImg}
                            width={500}
                            height={500}
                            alt={sectionContent?.image?.alt}
                            className='h-full w-full object-cover object-right scale-125'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function OurMissionVision({
    mission,
    vision,
}: {
    mission: SECTION
    vision: SECTION
}) {
    return (
        <section id='mission-vision' className='my-4'>
            <div className='max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 col-span-2 mx-auto px-6 2xl:px-0'>
                <div className='space-y-4 py-6 lg:py-24'>
                    <div className='w-20 h-20 rounded-full bg-brandaccent-100 p-4 text-brandprimary-700'>
                        <Rocket className='h-full w-full' />
                    </div>
                    <Badge className='rounded-full'>Our Mission</Badge>
                    <Heading type='h2' className='text-current max-w-lg'>
                        {mission?.title}
                    </Heading>
                    <Text className='text-current font-light max-w-lg'>
                        {mission?.description}
                    </Text>
                </div>
                <div className='space-y-4 py-6 lg:py-24'>
                    <div className='w-20 h-20 rounded-full bg-brandaccent-100 p-4 text-brandprimary-700'>
                        <Target className='h-full w-full' />
                    </div>
                    <Badge className='rounded-full'>Our Vision</Badge>
                    <Heading type='h2' className='text-current'>
                        {vision?.title}
                    </Heading>
                    <Text className='text-current font-light max-w-lg'>
                        {vision?.description}
                    </Text>
                </div>
            </div>
        </section>
    )
}

function OurValues({ sectionContent }: { sectionContent: SECTION }) {
    const icons = {
        footprints: <Footprints className='h-8 w-8' />,
        handshake: <Handshake className='h-8 w-8' />,
        focus: <Focus className='h-8 w-8' />,
        shieldcheck: <ShieldCheck className='h-8 w-8' />,
        briefcasebusiness: <BriefcaseBusiness className='h-8 w-8' />,
    }

    return (
        <section id='values' className='bg-brandaccent-50'>
            <div className='max-w-screen-2xl col-span-2 mx-auto px-6 2xl:px-0'>
                <div className='space-y-6 py-6 lg:py-24'>
                    <Badge className='rounded-full'>Our Values</Badge>
                    <Heading type='h2' className='text-current max-w-md'>
                        Values that drive our mission.
                    </Heading>
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-10 '>
                        <ListWrapper
                            itemKey='title'
                            list={sectionContent?.values ?? []}>
                            {(item: VALUE) => {
                                const icon = icons[item?.icon]
                                return (
                                    <div className='space-y-3 bg-brand-background p-4 rounded-lg'>
                                        <span className='text-brandprimary-700'>
                                            {icon}
                                        </span>
                                        <Heading
                                            type='h4'
                                            className='text-current'>
                                            {item?.value}
                                        </Heading>
                                        <Text className='text-current font-light'>
                                            {item?.description}
                                        </Text>
                                    </div>
                                )
                            }}
                        </ListWrapper>
                    </div>
                </div>
            </div>
        </section>
    )
}

function OurTeam({ sectionContent }: { sectionContent: SECTION }) {
    return (
        <section id='team'>
            <div className='max-w-screen-2xl col-span-2 mx-auto px-6 2xl:px-0'>
                <div className='space-y-6 py-6 lg:py-24'>
                    <div className='space-y-4 max-w-xl'>
                        <Badge className='rounded-full'>Our Team</Badge>
                        <Heading type='h2' className='text-current max-w-md'>
                            {sectionContent?.title}
                        </Heading>
                        <Text>{sectionContent?.description}</Text>
                    </div>
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:gap-10 '>
                        <ListWrapper
                            list={sectionContent?.members ?? []}
                            itemKey='name'>
                            {(member: AUTHOR) => {
                                return (
                                    <Link
                                        href={`/about-us/${member.slug?.current}`}>
                                        <AboutMember
                                            hideBio
                                            hidePosts
                                            largeProfile
                                            author={formatAuthor(member)}
                                        />
                                    </Link>
                                )
                            }}
                        </ListWrapper>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUs

//vSak!vn8JJ*@ roundcube mail password
