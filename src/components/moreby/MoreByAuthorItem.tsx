import React from 'react'
import Link from 'next/link'

import { ARTICLE } from '@/types'
import Text from '../common/atoms/Text'

type MoreByAuthorItemProps = {
    post: ARTICLE
}

function MoreByAuthorItem({ post }: MoreByAuthorItemProps) {
    return (
        <div className='flex items-start flex-col gap-2'>
            <Link href={`/articles/${post?.slug}`} passHref>
                <Text className='cursor-pointer font-semibold'>
                    {post?.title}
                </Text>
            </Link>
            <div className='flex items-start flex-wrap'>
                {post?.tags &&
                    post?.tags.slice(0, 2).map((tag) => (
                        <Link
                            key={tag}
                            className='cursor-pointer capitalize text-sm'
                            href={`/articles?category=${tag}`}
                            shallow>
                            # {tag}
                        </Link>
                    ))}
            </div>
        </div>
    )
}

MoreByAuthorItem.defaultProps = {
    post: {},
}

export default MoreByAuthorItem
