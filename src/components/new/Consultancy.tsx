import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import AesopLink from '../common/atoms/AesopLink'
import Image from 'next/image'
import React from 'react'
import { SECTION } from '@sanity/utils/types'
import SanityCtaGroup from '../common/molecules/SanityCtaGroup'

type ConsultancyProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function Consultancy({ section }: ConsultancyProps) {
    return (
        <div className=''>
            <div className='relative mx-auto isolate px-5 container-fluid max-w-screen-2xl space-y-10 py-10 sm:py-40 lg:py-36 lg:px-8'>
                <div className='mx-auto flex flex-col items-end gap-10 md:flex-row'>
                    <div className='w-full h-80 px-6 lg:w-1/2 lg:px-0'>
                        <Image
                            alt='consultancy-hero'
                            src='/svg/understand.svg'
                            width={500}
                            height={500}
                            className='w-full h-full object-contain object-center rounded-xl'
                            unoptimized
                        />
                    </div>
                    <div className='w-full text-left lg:w-1/2'>
                        <Heading className='font-bold tracking-tight max-w-xl lg:text-4xl'>
                            {section?.title}
                        </Heading>
                        <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                            {section?.description}
                        </Text>
                        <SanityCtaGroup ctas={section?.cta ?? []} />
                    </div>
                    {/* Add a list of recent case studies */}
                </div>
                {/* <div className='w-full'>
                    <Heading type='h2'>Recent Case Studies</Heading>
                    <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                        <div className='h-48 bg-aes-light w-full rounded-xl hero-bg min-h-[25vh] relative overflow-hidden'>
                            <div className='absolute inset-0 w-full h-auto bg-gradient-to-b from-aes-dark/20 via-aes-dark/70 to-aes-dark'></div>
                        </div>
                        <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                        <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
export default Consultancy
