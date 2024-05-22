import React from 'react'
import Heading from './atoms/Heading'
import { cn } from '@src/lib/utils'
import AesopLink from './atoms/AesopLink'
import Text from './atoms/Text'
import Image from 'next/image'
// import Image from 'next/image'

type HeroProps = {} & React.HTMLAttributes<HTMLDivElement>

function Hero({ className }: HeroProps) {
    return (
        <section
            id='home'
            className={cn(
                'bg-aes-primary relative min-h-[60vh] h-auto',
                className
            )}>
            <div className='absolute isolate inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-aes-primary from-30% via-aes-primary/80 to-aes-primary/50 px-6 lg:px-8'>
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
                <div className='mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 '>
                    <div className=' space-y-3 py-10 sm:py-40 lg:py-28'>
                        <div className='sm:mb-8 sm:flex sm:justify-start'>
                            <div className='relative text-xs rounded-full px-3 py-1 font-sans leading-6 text-white ring-2 ring-gray-100/10 hover:ring-gray-200/20 lg:text-base '>
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
                            <Heading className='md:text-6xl font-black tracking-tight text-gray-100'>
                                Unveiling Insights Crafting Tomorrow.
                            </Heading>
                            <Text className='my-4 lg:my-8 leading-8 text-aes-light'>
                                Aesops aims to provide a platform for data
                                science, where we unveil and share insights with
                                our community. We provide tools, resources and
                                valuable expertise to help you gain a deeper
                                understanding of your data.
                            </Text>
                            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-start md:gap-x-6'>
                                <AesopLink
                                    variant='button'
                                    color='secondary'
                                    href='/blog'>
                                    Join the Community
                                </AesopLink>
                            </div>
                        </div>
                    </div>
                    <div className='hidden h-full w-full lg:flex items-center justify-center overflow-hidden p-28'>
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
