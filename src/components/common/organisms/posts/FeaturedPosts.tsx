import { Fragment } from 'react'

import PostCard from './PostCard'
import ListWrapper from '../../ListWrapper'
import { MIN_POST } from '@sanity/lib/types'
import Heading from '@components/common/atoms/Heading'
import { fetchFeaturedArticles } from '@sanity/lib/requests'

async function FeaturedPosts() {
    const featuredPosts = await fetchFeaturedArticles()

    const firstPost = featuredPosts[0]
    featuredPosts.shift()
    return (
        <div className='relative'>
            <div className='h-fit grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='relative col-span-1 flex items-center justify-center bg-aes-light rounded-xl lg:p-10 lg:col-span-2'>
                    <Heading
                        type='h1'
                        className=' absolute top-1 text-6xl md:top-28 left-5 md:text-[8rem] text-aes-secondary/30 z-0'>
                        Top Pick
                    </Heading>

                    <PostCard
                        topPick
                        post={firstPost}
                        className='relative bg-transparent border-none h-fit max-w-xl mx-auto bg-aes-primary p-5 text-aes-light rounded-xl md:p-16'
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
