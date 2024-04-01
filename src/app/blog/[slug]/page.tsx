import Image from 'next/image'
import { urlForImage } from '@sanity/lib/image'
import { getPostBySlug } from '@sanity/lib/requests'

import Share from '@src/components/common/ShareBtns'
import Heading from '@components/common/atoms/Heading'
import parseOutline from '@src/lib/sanity/parseOutline'
import { formatAuthor } from '@src/lib/sanity/formatAuthor'
import ContentReader from '@src/components/common/ContentReader'
import ContentHeadingReader from '@src/components/common/ContentHeadingReader'
import AuthorCard from '@src/components/common/organisms/author-card/AuthorCard'
import AboutAuthor from '@src/components/common/organisms/about-author/AboutAuthor'
import RecentPosts from '@src/components/common/organisms/posts/RecentPosts'
import BreadCrumbs from '@src/components/common/organisms/bread-crumbs/BreadCrumbs'

async function Blog({ params }) {
    const slug = params?.slug

    if (!slug) return null

    const post = await getPostBySlug(slug)
    const imageUrl = post?.mainImage ? urlForImage(post?.mainImage) : ''
    const outline = post?.body ? parseOutline(post?.body) : []

    const recentPosts = post?.recentPosts ?? []

    return (
        <div className='min-h-screen pb-28'>
            <div className='relative mx-auto flex max-w-screen-xl items-start justify-between gap-x-12 py-20'>
                <div className='sticky left-0 top-28 z-10 h-96 w-1/5 rounded '>
                    <ContentHeadingReader outline={outline} />
                    <Share title={post?.title} />
                </div>
                <div className='mx-auto w-1/2 max-w-screen-xl space-y-5'>
                    <div className='space-y-2'>
                        <BreadCrumbs />
                        <Heading type='h1' className='capitalize'>
                            {post?.title}
                        </Heading>
                        <AuthorCard
                            author={post?.author}
                            date={new Date(post?.publishedAt).toDateString()}
                            readTime={post?.readTime}
                        />
                    </div>
                    {post?.mainImage ? (
                        <Image
                            width={500}
                            height={500}
                            src={imageUrl}
                            alt={post?.mainImage.alt}
                            className='h-[35vh] w-full rounded-md object-cover'
                        />
                    ) : null}
                    <div>
                        <ContentReader content={post?.body} />
                    </div>
                </div>
                <div className='sticky left-0 top-24 z-10 h-fit w-1/4 px-2 space-y-6'>
                    <AboutAuthor author={formatAuthor(post?.author)} />
                    <RecentPosts posts={recentPosts} />
                </div>
            </div>
        </div>
    )
}

export default Blog
