import Link from 'next/link'
import DatasetsList from './DatasetsList'
import Heading from '../common/atoms/Heading'

function Datasets() {
    return (
        <div className=''>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-xl py-32 sm:py-40 lg:py-36'>
                    <div className='text-left'>
                        <Heading className='text-4xl font-bold tracking-tight'>
                            Datasets.
                        </Heading>
                        <p className='my-4 leading-8 text-gray-600 max-w-xl'>
                            Discover unique datasets from Kenya, or Africa that
                            are largely under-represented in the data science
                            community.
                        </p>
                        <div className='flex items-center gap-x-6'>
                            <Link
                                passHref
                                href='/datasets/#share-your-dataset'
                                className='rounded-full bg-aes-primary py-3 px-5 text-aes-light'>
                                Share your Dataset
                            </Link>
                            <Link
                                href='/datasets'
                                className='text-sm font-semibold leading-6 text-aes-dark underline decoration-dashed underline-offset-4'>
                                View More Datasets{' '}
                                <span aria-hidden='true'>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    <DatasetsList />
                </div>
            </div>
        </div>
    )
}
export default Datasets
