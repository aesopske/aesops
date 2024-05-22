import Text from '../common/atoms/Text'
import Heading from '../common/atoms/Heading'
import AesopLink from '../common/atoms/AesopLink'
import Image from 'next/image'

function Community() {
    return (
        <div className=''>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-xl py-10 sm:py-40 lg:py-32'>
                    <div className='flex flex-col md:flex-row gap-5'>
                        <div className='text-left'>
                            <Heading className='font-bold tracking-tight max-w-xl lg:text-4xl'>
                                Empowering our community through various
                                outreach events
                            </Heading>
                            <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                                Join us on a transformative journey of learning
                                and discovery with our outreach events. Whether
                                you&apos;re looking to upskill your team, drive
                                innovation, or enhance business performance, our
                                trainings are your gateway to unlocking the full
                                potential of data. Invest in the future success
                                of your organization and empower your team to
                                thrive in the data-driven era.
                            </Text>
                            <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-x-6'>
                                <AesopLink
                                    passHref
                                    variant='button'
                                    color='primary'
                                    href='/community/events'>
                                    Upcoming Events
                                </AesopLink>
                                <AesopLink
                                    href='/community/competitions'
                                    className='font-semibold leading-6 text-aes-dark'>
                                    Competitions
                                    <span aria-hidden='true'>&rarr;</span>
                                </AesopLink>
                            </div>
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
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                        </div>
                    </div>
                    <div>
                        <Heading type='h3'>Note from community members</Heading>
                        <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
export default Community
