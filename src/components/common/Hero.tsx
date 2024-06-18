import React from 'react'
import Image from 'next/image'

import { cn } from '@src/lib/utils'
import { SECTION } from '@sanity/utils/types'
import Text from '@components/common/atoms/Text'
import Heading from '@components/common/atoms/Heading'
import AesopLink from '@components/common/atoms/AesopLink'
import SanityCtaGroup from './molecules/SanityCtaGroup'

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
    section: SECTION
}

function Hero({ className, section }: HeroProps) {
    return (
        <section
            id='hero'
            className={cn(
                'bg-aes-primary relative min-h-[50vh] h-auto',
                className,
            )}>
            <div className='relative isolate bg-gradient-to-b lg:bg-gradient-to-r from-aes-primary from-30% via-aes-primary/80 to-aes-primary/50 px-6 lg:px-8'>
                <div
                    className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
                    aria-hidden='true'>
                    <div
                        className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-aes-light to-aes-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className='mx-auto max-w-screen-xl flex flex-col h-auto md:flex-row'>
                    <div className='w-full space-y-3 py-10 lg:py-28'>
                        <div className='sm:mb-8 sm:flex sm:justify-start'>
                            <div className='relative text-xs rounded-full px-3 py-1 font-sans leading-6 text-white ring-2 ring-gray-100/10 hover:ring-gray-200/20 lg:text-sm '>
                                Welcome to aesops&apos; new website.{' '}
                                <AesopLink
                                    href='/blog'
                                    className='font-semibold text-aes-secondary'>
                                    <span
                                        className='absolute inset-0'
                                        aria-hidden='true'
                                    />
                                    Explore{' '}
                                    <span aria-hidden='true'>&rarr;</span>
                                </AesopLink>
                            </div>
                        </div>
                        <div className='text-left max-w-2xl'>
                            <Heading className='font-black tracking-tight text-gray-100 xl:text-6xl'>
                                {section?.title}
                            </Heading>
                            <Text className='my-4 lg:my-8 leading-8 text-aes-light'>
                                {section?.description}
                            </Text>
                            <SanityCtaGroup ctas={section?.cta ?? []} />
                        </div>
                    </div>
                    <div className='hidden h-full w-full  items-center justify-center overflow-hidden p-28 pr-0 lg:flex'>
                        <Image
                            unoptimized
                            src='/svg/datapoints.svg'
                            alt='hero'
                            width={500}
                            height={500}
                            className='w-full h-full object-contain object-center'
                        />
                    </div>
                </div>

                <div
                    className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
                    aria-hidden='true'>
                    <div
                        className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-aes-light to-aes-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
export default Hero
