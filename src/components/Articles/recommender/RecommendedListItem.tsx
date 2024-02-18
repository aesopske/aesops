import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import readTime from 'reading-time'

import { ARTICLE } from '@/types'
import UserAvatar from '../../common/UserAvatar'

type RecommendedListItemProps = {
    item: ARTICLE
}

function RecommendedListItem({ item }: RecommendedListItemProps) {
    const date = format(new Date(item?.created), 'MMM dd')
    const { text } = readTime(item?.body)

    const user = {
        name: item?.author,
        date,
        read: text,
        photoURL: item?.author_image,
    }

    return (
        <div className='flex items-start flex-col gap-2'>
            <div className='flex flex-col items-start gap-3 justify-between'>
                <Link
                    href={{ pathname: `/articles/${item?.slug}` }}
                    passHref
                    className='cursor-pointer font-semibold'>
                    {item?.title}
                </Link>
                <UserAvatar user={user} />
            </div>
        </div>
    )
}

export default RecommendedListItem
