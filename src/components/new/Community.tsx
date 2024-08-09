import React from 'react'
import Image from 'next/image'
import { SECTION } from '@sanity/utils/types'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import SanityCtaGroup from '@components/common/molecules/SanityCtaGroup'

type CommunityProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function Community({ section }: CommunityProps) {
    return (
        <div className=''>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-2xl py-10 sm:py-40 lg:py-32'>
                    <div className='flex flex-col md:flex-row gap-5'>
                        <div className='text-left'>
                            <Heading
                                type='h2'
                                className='font-bold tracking-tight max-w-lg'>
                                {section?.title}
                            </Heading>
                            <Text className='my-4 leading-8 text-gray-600 max-w-lg'>
                                {section?.description}
                            </Text>
                            <SanityCtaGroup ctas={section?.cta ?? []} />
                        </div>

                        <div className='w-full h-80 px-6 lg:w-1/2 lg:px-0'>
                            <Image
                                alt='consultancy-hero'
                                src='/svg/learning.svg'
                                width={500}
                                height={500}
                                className='w-full h-full object-contain object-center rounded-xl'
                                unoptimized
                            />
                        </div>
                    </div>
                    {/* <div>
                        <Heading type='h3'>Top pick events</Heading>
                        <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                            <div className='h-48 bg-brandaccent-50 w-full rounded-xl'></div>
                            <div className='h-48 bg-brandaccent-50 w-full rounded-xl'></div>
                            <div className='h-48 bg-brandaccent-50 w-full rounded-xl'></div>
                        </div>
                    </div>
                    <div>
                        <Heading type='h3'>Note from community members</Heading>
                        <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                            <div className='h-48 bg-brandaccent-50 w-full rounded-xl'></div>
                            <div className='h-48 bg-brandaccent-50 w-full rounded-xl'></div>
                            <div className='h-48 bg-brandaccent-50 w-full rounded-xl'></div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
export default Community
