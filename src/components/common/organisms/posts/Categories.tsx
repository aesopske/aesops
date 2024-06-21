'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY } from '@sanity/utils/types'

import { cn } from '@src/lib/utils'
import Heading from '../../atoms/Heading'
import ListWrapper from '../../ListWrapper'
import { Button } from '@src/components/ui'
import { Badge } from '@src/components/ui/badge'

type CategoriesProps = {
    search: string
    categories: CATEGORY[]
    className?: string
} & React.HTMLAttributes<HTMLDivElement>

function Categories({ search, categories, className }: CategoriesProps) {
    const router = useRouter()

    const selectCategory = (category?: string) => {
        if (!category) {
            router.replace(`/blog`, { scroll: false })
            return
        }

        router.replace(`/blog?category=${category}#${category}`, {
            scroll: false,
        })
    }
    return (
        <div className={cn('relative w-full col-span-1 md:px-4', className)}>
            <div className='bg-brandprimary-700 rounded-lg min-h-32 sticky top-24 right-0 z-10 p-5 text-brandaccent-50 space-y-4'>
                <Heading type='h4' className='font-black'>
                    Categories Topics
                </Heading>
                <hr className='border border-brandaccent-50/20 my-2' />

                <div className='flex flex-wrap gap-2'>
                    <ListWrapper list={categories} itemKey='title'>
                        {(category: CATEGORY) => (
                            <Badge
                                role='button'
                                data-selected={
                                    category?.slug?.current === search
                                }
                                onClick={() =>
                                    selectCategory(category?.slug?.current)
                                }
                                variant='default'
                                className='text-brandaccent-50 py-2 rounded-full data-[selected=true]:bg-brandaccent-50 data-[selected=true]:text-brandprimary-900'>
                                {category.title}
                            </Badge>
                        )}
                    </ListWrapper>
                </div>

                {search ? (
                    <Button
                        variant='link'
                        onClick={() => selectCategory()}
                        className='text-brandaccent-50 p-0'>
                        Clear filter
                    </Button>
                ) : null}
            </div>
        </div>
    )
}
export default Categories
