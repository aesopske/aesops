import React from 'react'
import Image from 'next/image'
import { SECTION } from '@sanity/utils/types'
import Animate from '../common/atoms/Animate'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import SanityCtaGroup from '../common/molecules/SanityCtaGroup'
import Services from './Services'

type ConsultancyProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function Consultancy({ section }: ConsultancyProps) {
    return (
        <section id='consultancy' className='bg-brandaccent-50/50'>
            <div className='mx-auto px-4 max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) space-y-10 py-10 lg:py-28 2xl:px-0'>
                <div className='mx-auto flex flex-col items-end gap-10 md:flex-row'>
                    <Animate
                        dir='up'
                        className='w-full h-80 px-6 lg:w-1/2 lg:px-0'>
                        <Image
                            alt='consultancy-hero'
                            src='/svg/understand.svg'
                            width={500}
                            height={500}
                            className='w-full h-full object-contain object-center rounded-xl'
                            unoptimized
                        />
                    </Animate>
                    <Animate dir='up' className='w-full text-left lg:w-1/2'>
                        <Heading
                            type='h2'
                            className='font-bold tracking-tight max-w-lg'>
                            {section?.title}
                        </Heading>
                        <Text className='my-4 leading-8 text-gray-600 max-w-lg'>
                            {section?.description}
                        </Text>
                        <SanityCtaGroup ctas={section?.cta ?? []} />
                    </Animate>
                </div>
                <div className='w-full'>
                    <Services services={section?.services ?? []} />
                </div>
            </div>
        </section>
    )
}
export default Consultancy
