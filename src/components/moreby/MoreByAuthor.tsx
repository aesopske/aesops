import React from 'react'

import { ARTICLE, USER } from '@/types'
import MoreByAuthorItem from './MoreByAuthorItem'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import { Separator } from '../ui/separator'

type MoreByAuthorProps = {
    user: Pick<USER, 'name' | 'email'> | null
    posts: ARTICLE[]
    current: Pick<ARTICLE, '_id'> | null
}

function MoreByAuthor({ user, posts, current }: MoreByAuthorProps) {
    const filtered = posts && posts.filter((post) => post?._id !== current?._id)
    return (
        <div className='w-full p-6 rounded-xl bg-white border shadow-sm'>
            <Heading type='h4' className='text-semibold'>
                More from author
            </Heading>
            <Separator className='my-4 border border-gray-100' />

            <div className='grid grid-cols-1 gap-2'>
                {filtered &&
                    filtered.map((post) => (
                        <>
                            <MoreByAuthorItem key={post._id} post={post} />
                            <Separator className='border border-gray-100 last:hidden' />
                        </>
                    ))}
            </div>
            {!filtered.length && (
                <div className='flex items-center justify-center gap-2 h-full'>
                    <Text className='text-sm'>😧</Text>
                    <Text className='text-sm'>
                        Can&apos;t find more fables by {user?.name}
                    </Text>
                </div>
            )}
        </div>
    )
}

export default MoreByAuthor
