import React from 'react'

import { cn } from '@src/lib/utils'

import { fetchRecentPosts } from '@sanity/utils/requests'
import { MIN_POST } from '@sanity/utils/types'

import ListWrapper from '@components/common/ListWrapper'
import AesopLink from '@components/common/atoms/AesopLink'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import PostCard from '@components/common/organisms/posts/PostCard'

type RecentPostsProps = {} & React.HTMLProps<HTMLDivElement>

async function RecentPosts({ className }: RecentPostsProps) {
    const posts = await fetchRecentPosts()

    return (
        <section id='recent-posts' className={cn('w-full', className)}>
            <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-2xl py-10 sm:py-40 lg:py-20'>
                <div className='text-left'>
                    <Heading className='text-4xl font-bold tracking-tight'>
                        Recent Posts
                    </Heading>
                    <Text className='my-4 leading-8 text-gray-600 max-w-xl'>
                        Stay updated with the latest stories and insights about
                        data science and technology from us and our community.
                    </Text>
                    <Text className='flex items-center gap-x-6'>
                        <AesopLink variant='primary' type='button' href='/blog'>
                            View All Posts &rarr;
                        </AesopLink>
                    </Text>
                </div>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                    <ListWrapper list={posts} itemKey='_key'>
                        {(post: MIN_POST) => <PostCard post={post} />}
                    </ListWrapper>
                </div>
            </div>
        </section>
    )
}
export default RecentPosts
