import Link from 'next/link'
import React, { useEffect, useState, Fragment } from 'react'

import Text from '@/components/common/atoms/Text'
import Heading from '@/components/common/atoms/Heading'

import RecommendedListItem from './RecommendedListItem'
import { fetchRecommended } from '@/utils/requests'
import { Separator } from '@/components/ui/separator'
import { ARTICLE } from '@/types'

type RecommendedListProps = {
    title: string | undefined
}

function RecommendedList({ title }: RecommendedListProps) {
    const [recommended, setRecommended] = useState([])

    useEffect(() => {
        if (title) {
            const fetchAll = async () => {
                try {
                    const recommendations = await fetchRecommended(title)
                    setRecommended(recommendations.items)
                } catch (error) {
                    setRecommended([])
                }
            }
            fetchAll()
        }
    }, [title])
    return (
        <div className='w-full p-5 bg-white  rounded-xl border shadow-sm'>
            <Heading type='h4' className='font-semibold'>
                Recommended Posts
            </Heading>
            <Separator my='1rem' className='my-4 border border-gray-100' />
            <div className='grid grid-cols-1 gap-4'>
                {recommended &&
                    recommended.map((item: ARTICLE) => (
                        <Fragment key={item?.id}>
                            <RecommendedListItem key={item._id} item={item} />
                            <Separator className='border border-gray-100 last:hidden' />
                        </Fragment>
                    ))}
            </div>
            {!recommended.length && (
                <div className='flex flex-col items-center justify-center h-full'>
                    <Text as='span'>😧</Text>
                    <Text className='text-center'>
                        No similar recommendations found.
                    </Text>
                    <Link href='/articles' passHref>
                        Continue Exploring &rarr;
                    </Link>
                </div>
            )}
        </div>
    )
}

export default RecommendedList
