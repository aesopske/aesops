import React from 'react'
import Image from 'next/image'
import { cn } from '@src/lib/utils'
import { urlForImage } from '@sanity/utils/image'
import { SECTION } from '@sanity/utils/types'
import AesopLink from '@components/common/atoms/AesopLink'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import Animate from './atoms/Animate'

// import SubscriptionForm from '../new/SubscriptionForm'

// import SanityCtaGroup from './molecules/SanityCtaGroup'

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
    section: SECTION
}

function Hero({ className, section }: HeroProps) {
    const imageUrl = section?.image ? urlForImage(section?.image) : ''
    return (
        <section
            id='hero'
            className={cn(
                'bg-brandprimary-700 relative max-h-screen md:min-h-[80vh] md:h-auto lg:max-h-[60vh] lg:py-20 overflow-hidden flex items-center justify-center',
                className,
            )}>
            <div className='relative isolate bg-linear-to-b lg:bg-linear-to-r from-brandprimary-700 from-30% via-brandprimary-700/80 to-brandprimary-700/50 px-6 lg:px-8 w-full'>
                <div
                    className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
                    aria-hidden='true'>
                    <div
                        className='relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-brandaccent-50 to-brandaccent-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <div className='mx-auto max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) flex flex-col h-auto lg:flex-row lg:items-center lg:justify-between lg:gap-10'>
                    <Animate
                        dir='up'
                        className='w-full space-y-3 py-10 lg:py-24'>
                        <div className='sm:mb-8 sm:flex sm:justify-start'>
                            <div className='relative text-xs rounded-full px-3 py-1 font-sans leading-6 text-white ring-2 ring-gray-100/10 hover:ring-gray-200/20 lg:text-sm w-fit '>
                                Welcome to aesops&apos; new website.{' '}
                                <AesopLink
                                    href='/blog'
                                    className='font-semibold text-brandaccent-500'>
                                    <span
                                        className='absolute inset-0'
                                        aria-hidden='true'
                                    />
                                    Explore{' '}
                                    <span aria-hidden='true'>&rarr;</span>
                                </AesopLink>
                            </div>
                        </div>
                        <div className='text-left max-w-xl  w-full '>
                            <Heading className='font-black tracking-tight text-gray-100 xl:text-6xl'>
                                {section?.title}
                            </Heading>
                            <Text className='my-4 lg:my-8 leading-8 text-brandaccent-50'>
                                {section?.description}
                            </Text>
                            <div className='max-w-md space-y-3 w-full'>
                                <Heading type='h5' className='text-white'>
                                    Get the latest news and updates.
                                </Heading>
                                <AesopLink
                                    type='button'
                                    variant='secondary'
                                    href='/#subscribe'>
                                    Join our community &rarr;
                                </AesopLink>
                                {/* <SubscriptionForm dir='row' /> */}
                            </div>
                        </div>
                    </Animate>
                    <Animate
                        dir='down'
                        className='hidden h-full w-full px-8 items-center justify-center xl:flex 3xl:px-0 '>
                        <Image
                            src={imageUrl ?? '/svg/datapoints.svg'}
                            alt={section?.image?.alt}
                            width={800}
                            height={800}
                            className='w-full h-full object-contain object-center scale-100 lg:scale-125 relative left-5 lg:left-0 aspect-ratio'
                        />
                    </Animate>
                </div>

                <div
                    className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
                    aria-hidden='true'>
                    <div
                        className='relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-brandaccent-50 to-brandaccent-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
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
