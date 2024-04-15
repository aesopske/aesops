import React from 'react'
import Heading from './atoms/Heading'
import { cn } from '@src/lib/utils'

type HeroProps = {} & React.HTMLAttributes<HTMLDivElement>

function Hero({ className }: HeroProps) {
    return (
        <div className={cn('bg-aes-primary', className)}>
            <div className='relative isolate px-6 pt-14 lg:px-8'>
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
                <div className='mx-auto max-w-screen-xl grid grid-cols-4 py-32 sm:py-40 lg:py-28'>
                    <div className='col-span-2'>
                        <div className='hidden sm:mb-8 sm:flex sm:justify-start'>
                            <div className='relative rounded-full px-3 py-1 text-sm leading-6 text-white ring-2 ring-gray-100/10 hover:ring-gray-200/20'>
                                Unveiling aesops new website.{' '}
                                <a
                                    href='#'
                                    className='font-semibold text-aes-secondary'>
                                    <span
                                        className='absolute inset-0'
                                        aria-hidden='true'
                                    />
                                    Read more{' '}
                                    <span aria-hidden='true'>&rarr;</span>
                                </a>
                            </div>
                        </div>
                        <div className='text-left max-w-2xl'>
                            <Heading className='md:text-6xl font-black tracking-tight text-gray-100'>
                                Unveiling Insights Crafting Tomorrow.
                            </Heading>
                            <p className='my-8 leading-8 text-aes-light'>
                                Aesops aims to provide a platform for data
                                science, where we unveil and share insights with
                                our community. We provide tools, resources and
                                valuable expertise to help you gain a deeper
                                understanding of your data.
                            </p>
                            <div className='flex items-center justify-start gap-x-6'>
                                <a
                                    href='#'
                                    className='rounded-full bg-aes-secondary px-3.5 py-2.5 text-sm font-semibold text-aes-dark shadow-sm hover:bg-aes-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aes-secondary/70'>
                                    Join our community
                                </a>
                                <a
                                    href='#'
                                    className='text-sm font-semibold leading-6 text-aes-light'>
                                    Learn more <span aria-hidden='true'>→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div></div>
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
        </div>
    )
}
export default Hero
