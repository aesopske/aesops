import DatasetsList from './DatasetsList'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import AesopLink from '../common/atoms/AesopLink'

function Datasets() {
    return (
        <section id='datasets'>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-xl py-32 sm:py-40 lg:py-36'>
                    <div className='text-left'>
                        <Heading className='text-4xl font-bold tracking-tight'>
                            Datasets.
                        </Heading>
                        <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                            Discover unique datasets from Kenya, or Africa that
                            are largely under-represented in the data science
                            community.
                        </Text>
                        <Text className='flex items-center gap-x-6'>
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
                    <DatasetsList />
                </div>
            </div>
        </section>
    )
}
export default Datasets
