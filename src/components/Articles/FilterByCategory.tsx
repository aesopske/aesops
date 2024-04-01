'use client'

import React from 'react'
import { useRouter } from 'next/router'

import { CATEGORY } from '@/types'
import { useGa } from '@/context/TrackingProvider'
import { Badge } from '@/components/ui/badge'
import Heading from '@/components/common/atoms/Heading'
import ListWrapper from '@components/common/ListWrapper'

type FilterByCategoryProps = {
    categories: CATEGORY[]
    query?: string
}

function FilterByCategory({ categories, query }: FilterByCategoryProps) {
    const { gaEvent } = useGa()
    const router = useRouter()

    const handleClick = (category?: string) => {
        if (!category) {
            router.replace(`/articles`, undefined, {
                shallow: true,
            })
            return
        }
        gaEvent({
            category: 'BLOG',
            action: 'CATEGORY FILTER',
            label: category,
        })
        router.replace(`/articles?category=${category}`, undefined, {
            shallow: true,
        })
    }
    return (
        <div className='bg-white rounded-xl w-full min-h-48 sticky z-50 top-24 left-0 p-5 border border-gray-200'>
            <Heading type='h4' className=''>
                Filter by category
            </Heading>
            <hr className='border my-4 border-gray-200' />
            <div className='flex flex-wrap gap-2.5'>
                <button className='unset' onClick={() => handleClick()}>
                    <Badge
                        role='button'
                        variant={query ? 'secondary' : 'default'}
                        className='cursor-pointer py-2 rounded-full border border-gray-200'>
                        All Articles
                    </Badge>
                </button>

                <ListWrapper list={categories} itemKey='id'>
                    {(category: CATEGORY) => (
                        <Badge
                            role='button'
                            data-selected={query === category?.name}
                            onClick={() => handleClick(category?.name)}
                            key={category?.id}
                            variant={
                                query === category?.name
                                    ? 'default'
                                    : 'secondary'
                            }
                            className='cursor-pointer py-2 rounded-full hover:bg-gray-200 data-[selected=true]:hover:bg-gray-800'>
                            {category?.name}
                        </Badge>
                    )}
                </ListWrapper>
            </div>
        </div>
    )
}

export default FilterByCategory
