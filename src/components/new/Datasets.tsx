import React from 'react'
import Image from 'next/image'
import { SECTION } from '@sanity/utils/types'
import Animate from '../common/atoms/Animate'
// import DatasetsList from './DatasetsList'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import SanityCtaGroup from '../common/molecules/SanityCtaGroup'

type DatasetsProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function Datasets({ section }: DatasetsProps) {
    return (
        <section id='datasets'>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 max-w-screen-lg lg:max-w-screen-xl 2xl:max-w-screen-2xl py-6 sm:py-40 lg:py-36'>
                    <div className='flex flex-col-reverse md:flex-row gap-5'>
                        <Animate dir='up' className='text-left'>
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
                        <Animate
                            dir='up'
                            duration={0.8}
                            className='w-full h-76 px-20 md:w-1/2'>
                            <Image
                                alt='consultancy-hero'
                                src='/svg/dataset.svg'
                                width={500}
                                height={500}
                                className='w-full h-full object-contain object-center rounded-xl'
                                unoptimized
                            />
                        </Animate>
                    </div>
                    {/* <DatasetsList /> */}
                </div>
            </div>
        </section>
    )
}
export default Datasets
