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
            <div className='bg-aes-primary rounded-lg min-h-32 sticky top-24 right-0 z-10 p-5 text-aes-light space-y-4'>
                <Heading type='h4' className='font-black'>
                    Categories Topics
                </Heading>
                <hr className='border border-aes-light/20 my-2' />

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
                                className='text-aes-light py-2 rounded-full data-[selected=true]:bg-aes-light data-[selected=true]:text-aes-dark'>
                                {category.title}
                            </Badge>
                        )}
                    </ListWrapper>
                </div>

                {search ? (
                    <Button
                        variant='link'
                        onClick={() => selectCategory()}
                        className='text-aes-light p-0'>
                        Clear filter
                    </Button>
                ) : null}
            </div>
        </div>
    )
}
export default Categories
