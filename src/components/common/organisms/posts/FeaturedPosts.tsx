import { Fragment } from 'react'
import { MIN_POST } from '@sanity/utils/types'
import Heading from '@components/common/atoms/Heading'
import ListWrapper from '../../ListWrapper'
import PostCard from './PostCard'

type FeaturedPostsProps = {
    featuredPosts: MIN_POST[]
}

async function FeaturedPosts({ featuredPosts }: FeaturedPostsProps) {
    const firstPost = featuredPosts?.length > 0 ? featuredPosts?.[0] : null
    if (firstPost) {
        featuredPosts.shift()
    }
    return (
        <div className='relative'>
            <div className='h-fit grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 '>
                <div className='relative col-span-1 flex items-center justify-center bg-brandaccent-50 rounded-xl lg:p-10 lg:col-span-2'>
                    <Heading
                        type='h1'
                        className='hidden absolute top-1 text-6xl md:top-28 left-5 md:text-[8rem] text-brandaccent-500/30 z-0 lg:block'>
                        Top Pick
                    </Heading>

                    <PostCard
                        topPick
                        post={firstPost as MIN_POST}
                        className='relative bg-transparent border-none h-fit max-w-xl mx-auto bg-brandprimary-700 p-5 text-brandaccent-50 rounded-xl lg:p-16'
                    />
                </div>

                <div className='col-span-1 bg-white space-y-2 rounded-md border border-gray-100 overflow-hidden'>
                    <ListWrapper list={featuredPosts} itemKey='_key'>
                        {(post) => (
                            <Fragment>
                                <PostCard
                                    hideImage
                                    post={post as MIN_POST}
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
