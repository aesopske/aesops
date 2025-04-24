import React from 'react'
import HasBackgroundWrapper from '../common/HasBackgroundWrapper'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import Image from 'next/image'
import { SECTION } from '@sanity/utils/types'
import SanityCtaGroup from '../common/molecules/SanityCtaGroup'

type AboutSummaryProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function AboutSummary({ section }: AboutSummaryProps) {
    return (
        <HasBackgroundWrapper>
            <div className='h-full w-full text-white max-w-(--breakpoint-2xl) mx-auto  grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-col-3'>
                <div className='max-w-2xl space-y-6 text-brandaccent-50 px-5 py-24 pb-10 lg:py-48 xl:px-0'>
                    <Heading type='h1' className='text-current'>
                        {section?.title}
                    </Heading>
                    <Text className='text-current font-light'>
                        {section?.description}
                    </Text>
                    <SanityCtaGroup ctas={section?.cta ?? []} />
                </div>
                <div className='relative h-28 w-full md:h-full '>
                    <Image
                        src='/svg/quadpattern.svg'
                        alt='hero'
                        width={500}
                        height={1000}
                        className='object-cover w-full h-full object-center'
                        unoptimized
                    />
                </div>
            </div>
        </HasBackgroundWrapper>
    )
}

export default AboutSummary
