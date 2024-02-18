import Link from 'next/link'
import DatasetsList from './DatasetsList'
import Heading from '../common/atoms/Heading'

function BootCamps() {
    return (
        <div className=''>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-xl py-32 sm:py-40 lg:py-36'>
                    <div className='text-left'>
                        <Heading className='text-4xl font-bold tracking-tight max-w-xl'>
                            Empower Your Team with Data Boot Camps
                        </Heading>
                        <p className='my-4 leading-8 text-gray-600 max-w-xl'>
                            Join us on a transformative journey of learning and
                            discovery with our Data Boot Camps. Whether you're
                            looking to upskill your team, drive innovation, or
                            enhance business performance, our boot camps are
                            your gateway to unlocking the full potential of
                            data. Invest in the future success of your
                            organization and empower your team to thrive in the
                            data-driven era.
                        </p>
                        <div className='flex items-center gap-x-6'>
                            <Link
                                passHref
                                href='/datasets/#share-your-dataset'
                                className='rounded-full bg-aes-primary py-3 px-5 text-aes-light'>
                                See Available Bootcamps
                            </Link>
                            <Link
                                href='/datasets'
                                className='text-sm font-semibold leading-6 text-aes-dark underline decoration-dashed underline-offset-4'>
                                View More Datasets{' '}
                                <span aria-hidden='true'>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Heading type='h3'>
                            What our Graduates are Saying
                        </Heading>
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
export default BootCamps
