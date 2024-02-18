import Link from 'next/link'
import Heading from '../common/atoms/Heading'

function Consultancy() {
    return (
        <div className=''>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col items-end gap-10 container-fluid max-w-screen-xl py-32 sm:py-40 lg:py-36'>
                    <div className='text-left'>
                        <Heading className='text-4xl font-bold tracking-tight max-w-xl'>
                            Let us help you understand your data.
                        </Heading>
                        <p className='my-4 leading-8 text-gray-600 max-w-xl'>
                            Our consultancy services are designed to help you
                            understand your data and make informed decisions.
                            Our team of experts will work with you to identify
                            the best approach to your data and provide you with
                            actionable insights.
                        </p>
                        <div className='flex items-center justify-start gap-x-6'>
                            <Link
                                passHref
                                href='/datasets/#share-your-dataset'
                                className='rounded-full bg-aes-primary py-3 px-5 text-aes-light'>
                                Contact Us
                            </Link>
                            <Link
                                href='/consultancy'
                                className='text-sm font-semibold leading-6 text-aes-dark underline decoration-dashed underline-offset-4'>
                                View Public Case Studies{' '}
                                <span aria-hidden='true'>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    {/* Add a list of recent case studies */}
                    <div className='w-full'>
                        <Heading type='h2'>Recent Case Studies</Heading>
                        <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <Heading type='h3'>What our Clients are Saying</Heading>
                        <div className='grid grid-cols-1 my-6 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                            <div className='h-48 bg-aes-light w-full rounded-xl'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Consultancy
