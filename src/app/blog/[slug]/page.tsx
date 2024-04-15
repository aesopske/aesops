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
        <div className='min-h-screen py-6 lg:py-12 md:px-4 xl:px-0'>
            <div className='relative mx-auto gap-6 flex flex-col max-w-screen-xl items-start justify-between lg:gap-x-12 lg:flex-row'>
                <div className='hidden sticky w-full left-0 top-28 z-10 h-96 rounded lg:block lg:w-1/5'>
                    <ContentHeadingReader outline={outline} />
                    <Share title={post?.title} />
                </div>
                <div className='mx-auto w-full max-w-screen-xl space-y-5 lg:w-1/2'>
                    <div className='space-y-2 px-4 lg:px-0'>
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
                            className='h-[35vh] w-full object-cover lg:rounded-md'
                        />
                    ) : null}
                    <div className='px-4 space-y-6 lg:px-0'>
                        <ContentReader content={post?.body} />
                        <div className='lg:hidden'>
                            <Share title={post?.title} />
                        </div>
                    </div>
                </div>
                <div className='w-full px-4 left-0 top-24 z-10 h-fit space-y-6 lg:sticky lg:px-2 lg:w-1/4'>
                    <AboutAuthor author={formatAuthor(post?.author)} />
                    <RecentPosts posts={recentPosts} />
                </div>
            </div>
        </div>
    )
}

export default Blog
