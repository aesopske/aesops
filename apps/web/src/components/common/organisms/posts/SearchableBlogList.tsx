import { getPosts } from '~sanity/utils/requests'
import { BlogListBlock } from '~sanity/utils/types'
import BlogListSearch from './BlogListSearch'

async function SearchableBlogList({ block }: { block: BlogListBlock }) {
    const posts = await getPosts()
    return (
        <section className='w-full bg-background py-12'>
            <div className='mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                <BlogListSearch
                    posts={posts}
                    heading={block.heading}
                    description={block.description}
                />
            </div>
        </section>
    )
}

export default SearchableBlogList
