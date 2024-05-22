// import DatasetsList from './DatasetsList'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import AesopLink from '../common/atoms/AesopLink'
import Image from 'next/image'

function Datasets() {
    return (
        <section id='datasets'>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-xl py-10 sm:py-40 lg:py-36'>
                    <div className='flex flex-col-reverse md:flex-row gap-5'>
                        <div className='text-left'>
                            <Heading className='font-bold tracking-tight lg:text-4xl'>
                                Datasets.
                            </Heading>
                            <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                                Discover unique datasets from Kenya, or Africa
                                that are largely under-represented in the data
                                science community. We aim to provide a platform
                                to share and access datasets that are relevant
                                to the African context, and to help you gain a
                                deeper understanding of your data.
                            </Text>
                            <Text className='flex flex-col items-start md:flex-row gap-3 md:items-center md:gap-6'>
                                <AesopLink
                                    color='primary'
                                    variant='button'
                                    href='/datasets/#share-your-dataset'>
                                    Share your Dataset
                                </AesopLink>

                                <AesopLink href='/datasets'>
                                    View Datasets &rarr;
                                </AesopLink>
                            </Text>
                        </div>
                        <div className='w-full h-80 px-5 md:w-1/2'>
                            <Image
                                alt='consultancy-hero'
                                src='/svg/dataset.svg'
                                width={500}
                                height={500}
                                className='w-full h-full object-contain object-center rounded-xl'
                                unoptimized
                            />
                        </div>
                    </div>
                    {/* <DatasetsList /> */}
                </div>
            </div>
        </section>
    )
}
export default Datasets
