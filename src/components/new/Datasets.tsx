import React from 'react'
// import DatasetsList from './DatasetsList'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import AesopLink from '../common/atoms/AesopLink'
import Image from 'next/image'
import { SECTION } from '@sanity/utils/types'
import SanityCtaGroup from '../common/molecules/SanityCtaGroup'

type DatasetsProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function Datasets({ section }: DatasetsProps) {
    return (
        <section id='datasets'>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-xl py-10 sm:py-40 lg:py-36'>
                    <div className='flex flex-col-reverse md:flex-row gap-5'>
                        <div className='text-left'>
                            <Heading className='font-bold tracking-tight lg:text-4xl'>
                                {section?.title}
                            </Heading>
                            <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                                {section?.description}
                            </Text>
                            <SanityCtaGroup ctas={section?.cta ?? []} />
                        </div>
                        <div className='w-full h-80 px-5 md:w-1/2'>
                            <Image
                                alt='consultancy-hero'
                                src='/svg/dataset.svg'
                                width={500}
                                height={500}
                                className='w-full h-full object-contain object-center rounded-xl'
                                unoptimized
                            />
                        </div>
                    </div>
                    {/* <DatasetsList /> */}
                </div>
            </div>
        </section>
    )
}
export default Datasets
