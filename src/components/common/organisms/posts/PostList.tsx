import { getPosts } from '@sanity/lib/requests'
import ListWrapper from '../../ListWrapper'
import Heading from '../../atoms/Heading'
import { MIN_POST } from '@sanity/lib/types'
import PostCard from './PostCard'

async function PostList() {
    const posts = await getPosts()
    return (
        <div className=''>
            <Heading type='h2'>All Posts</Heading>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-5'>
                <ListWrapper list={posts} itemKey='slug.current'>
                    {(post: MIN_POST) => (
                        <PostCard
                            hideImage
                            post={post}
                            orientation='vertical'
                        />
                    )}
                </ListWrapper>
            </div>
        </div>
    )
}
export default PostList
