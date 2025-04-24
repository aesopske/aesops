import React from 'react'
import { cn } from '@src/lib/utils'
import { sanityFetch } from '@sanity/utils/fetch'
import { recentQuery } from '@sanity/utils/requests'
import { MIN_POST } from '@sanity/utils/types'
import ListWrapper from '@components/common/ListWrapper'
import AesopLink from '@components/common/atoms/AesopLink'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import PostCard from '@components/common/organisms/posts/PostCard'
import Animate from '../common/atoms/Animate'

type RecentPostsProps = {} & React.HTMLProps<HTMLDivElement>

async function RecentPosts({ className }: RecentPostsProps) {
    const posts = await sanityFetch<MIN_POST[]>({
        query: recentQuery,
    })

    return (
        <section id='recent-posts' className={cn('w-full', className)}>
            <div className='mx-auto flex flex-col gap-10 max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) py-10 px-4 lg:py-20 2xl:px-0'>
                <Animate dir='up' className='text-left'>
                    <Heading type='h2' className='font-bold tracking-tight'>
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
                </Animate>
                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
                    <ListWrapper list={posts ?? []} itemKey='_key'>
                        {(post, idx) => (
                            <Animate dir='up' duration={0.5 + idx * 0.1}>
                                <PostCard post={post} />
                            </Animate>
                        )}
                    </ListWrapper>
                </div>
            </div>
        </section>
    )
}
export default RecentPosts
