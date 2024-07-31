import React from 'react'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import Search from '@src/components/common/Search'
import Heading from '@src/components/common/atoms/Heading'
import Text from '@src/components/common/atoms/Text'

function DatasetsPage({ searchParams }) {
    const initialSection = {
        title: 'Datasets',
        description: 'Search for datasets to use in your projects',
    }
    return (
        <div className='min-h-screen'>
            <HasBackgroundWrapper className='h-72 relative'>
                <div className='flex flex-col gap-2  justify-center items-center h-full'>
                    <Heading className='font-bold text-white lg:text-5xl'>
                        {initialSection?.title}
                    </Heading>
                    <Text className='text-brandaccent-50'>
                        {initialSection?.description}
                    </Text>
                </div>
                <div className='absolute -bottom-5 -translate-x-1/2 left-1/2  bg-white max-w-lg h-14 shadow-md rounded-lg w-full mx-auto flex gap-2 py-1 px-2'>
                    <Search
                        label='Datasets search'
                        placeholder='Search datasets ...'
                        search={searchParams.search}
                    />
                </div>
            </HasBackgroundWrapper>
        </div>
    )
}

export default DatasetsPage
