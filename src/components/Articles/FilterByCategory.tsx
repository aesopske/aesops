'use client'

import React from 'react'
import { useRouter } from 'next/router'

import { CATEGORY } from '@/types'
import { useGa } from '@/context/TrackingProvider'
import { Badge } from '@/components/ui/badge'
import Heading from '@/components/common/atoms/Heading'
import { Separator } from '../ui/separator'
import Link from 'next/link'

type FilterByCategoryProps = {
    categories: CATEGORY[]
    query?: string
}

function FilterByCategory({ categories, query }: FilterByCategoryProps) {
    const { gaEvent } = useGa()
    const router = useRouter()

    const handleClick = (category: string) => {
        if (!category) {
            router.replace(`/articles`, undefined, {
                shallow: true,
            })
            return
        }
        gaEvent('BLOG', 'CATEGORY FILTER', category)
        router.replace(`/articles?category=${category}`, undefined, {
            shallow: true,
        })
    }
    return (
        <div className='bg-white rounded-xl w-full min-h-48 sticky z-50 top-24 left-0 p-5 border border-gray-200'>
            <Heading type='h4' className=''>
                Filter by category
            </Heading>
            <Separator className='border my-4' />
            <div className='flex flex-wrap gap-2.5'>
                <Badge
                    role='button'
                    onClick={handleClick}
                    className='cursor-pointer py-2 rounded-full border-none'>
                    All Articles
                </Badge>

                {categories &&
                    categories.map((category) => (
                        <Badge
                            role='button'
                            onClick={() => handleClick(category?.name)}
                            key={category?.id}
                            variant={
                                query === category?.name
                                    ? 'secondary'
                                    : 'primary'
                            }
                            className={
                                'cursor-pointer py-2 rounded-full hover:bg-gray-200'
                            }
                            colorScheme={
                                query === category?.name ? 'purple' : 'gray'
                            }>
                            {category?.name}
                        </Badge>
                    ))}
            </div>
        </div>
    )
}

export default FilterByCategory
