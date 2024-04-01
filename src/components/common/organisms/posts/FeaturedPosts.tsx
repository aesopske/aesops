import { Fragment } from 'react'

import PostCard from './PostCard'
import ListWrapper from '../../ListWrapper'
import { MIN_POST } from '@sanity/lib/types'
import { fetchFeaturedArticles } from '@sanity/lib/requests'

async function FeaturedPosts() {
    const featuredPosts = await fetchFeaturedArticles()

    const firstPost = featuredPosts[0]
    featuredPosts.shift()
    return (
        <div className='relative'>
            <div className='h-fit grid grid-cols-3 gap-6'>
                <div className='col-span-2 flex items-center justify-center bg-aes-light rounded-xl'>
                    <PostCard
                        post={firstPost}
                        orientation='vertical'
                        className='bg-transparent border-none h-fit max-w-xl mx-auto'
                    />
                </div>

                <div className='col-span-1 bg-white space-y-2 rounded-md border border-gray-100 overflow-hidden'>
                    <ListWrapper list={featuredPosts} itemKey='_key'>
                        {(post: MIN_POST) => (
                            <Fragment>
                                <PostCard
                                    hideImage
                                    post={post}
                                    className='h-fit border-none'
                                />
                                <hr className='border border-gray-100 last:hidden mx-auto w-[95%]' />
                            </Fragment>
                        )}
                    </ListWrapper>
                </div>
            </div>
        </div>
    )
}
export default FeaturedPosts
