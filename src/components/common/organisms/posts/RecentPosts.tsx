import { MIN_POST } from '@sanity/utils/types'
import SmallPostCard from './SmallPostCard'
import ListWrapper from '@components/common/ListWrapper'
import Heading from '@components/common/atoms/Heading'

function RecentPosts({ posts }: { posts: MIN_POST[] }) {
    if (!posts || posts.length === 0) return null
    return (
        <div className='space-y-3 my-6'>
            <Heading type='h4' className='capitalize font-semibold'>
                Recent Posts
            </Heading>
            <div className='flex flex-col gap-3'>
                <ListWrapper list={posts} itemKey='_key'>
                    {(post: MIN_POST) => <SmallPostCard post={post} />}
                </ListWrapper>
            </div>
        </div>
    )
}
export default RecentPosts
