import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import AesopLink from '../common/atoms/AesopLink'
import Image from 'next/image'

function Consultancy() {
    return (
        <div className=''>
            <div className='relative mx-auto isolate px-5 container-fluid max-w-screen-xl space-y-10 py-10 sm:py-40 lg:py-36 lg:px-8'>
                <div className='mx-auto flex flex-col items-end gap-10 md:flex-row'>
                    <div className='w-1/2 h-80'>
                        <Image
                            alt='consultancy-hero'
                            src='/svg/understand.svg'
                            width={500}
                            height={500}
                            className='w-full h-full object-contain object-center rounded-xl'
                            unoptimized
                        />
                    </div>
                    <div className='text-left w-1/2'>
                        <Heading className='text-4xl font-bold tracking-tight max-w-xl'>
                            Let us help you understand your data.
                        </Heading>
                        <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                            Our consultancy services are designed to help you
                            understand your data and make informed decisions.
                            Our team of experts will work with you to identify
                            the best approach to your data and provide you with
                            actionable insights.
                        </Text>
                        <div className='flex flex-col gap-3  md:flex-row md:items-center md:justify-start md:gap-x-6'>
                            <AesopLink
                                passHref
                                variant='button'
                                color='primary'
                                href='/datasets/#share-your-dataset'>
                                Contact Us
                            </AesopLink>
                            <AesopLink
                                href='/consultancy'
                                className='font-semibold leading-6 text-aes-dark'>
                                View Public Case Studies{' '}
                                <span aria-hidden='true'>&rarr;</span>
                            </AesopLink>
                        </div>
                    </div>
                    {/* Add a list of recent case studies */}
                </div>
                <div className='w-full'>
                    <Heading type='h2'>Recent Case Studies</Heading>
                    <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                        <div className='h-48 bg-aes-light w-full rounded-xl hero-bg min-h-[25vh] relative overflow-hidden'>
                            <div className='absolute inset-0 w-full h-auto bg-gradient-to-b from-aes-dark/20 via-aes-dark/70 to-aes-dark'></div>
                        </div>
                        <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                        <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Consultancy
