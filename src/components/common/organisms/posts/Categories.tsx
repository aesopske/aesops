'use client'

import { CATEGORY } from '@sanity/lib/types'
import ListWrapper from '../../ListWrapper'
import Heading from '../../atoms/Heading'
import { Badge } from '@src/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Button } from '@src/components/ui'

function Categories({ search, categories }) {
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
        <div className='relative w-full col-span-1 px-4'>
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
