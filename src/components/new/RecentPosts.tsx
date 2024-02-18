import { fetchFeaturedArticles } from '@/utils/requests'
import FeaturedCard from '../Articles/FeaturedCard'
import Heading from '@components/common/atoms/Heading'
import { ARTICLE } from '@/types'
import Link from 'next/link'

async function RecentPosts() {
    const posts = await fetchFeaturedArticles()
    return (
        <section className='container-fluid mx-auto max-w-screen-xl w-full px-6 py-32 flex flex-col gap-10'>
            <div className='flex items-center justify-between gap-5'>
                <Heading>Recent Posts</Heading>
                <Link
                    href='/articles'
                    passHref
                    className='underline decoration-dashed underline-offset-4 border-gray-700'>
                    View More Posts &rarr;
                </Link>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {posts.items.map((post: ARTICLE) => (
                    <FeaturedCard key={post.slug} article={post} />
                ))}
            </div>
        </section>
    )
}
export default RecentPosts
