import { Metadata, ResolvingMetadata } from 'next'
import { QueryParams } from 'next-sanity'
import { notFound } from 'next/navigation'
import ContentHeadingReader from '@src/components/common/ContentHeadingReader'
import ContentReader from '@src/components/common/ContentReader'
import Share from '@src/components/common/ShareBtns'
import ImageWithModal from '@src/components/common/molecules/image-with-modal/ImageWithModal'
import AboutAuthor from '@src/components/common/organisms/about-author/AboutAuthor'
import AuthorCard from '@src/components/common/organisms/author-card/AuthorCard'
import BreadCrumbs from '@src/components/common/organisms/bread-crumbs/BreadCrumbs'
import RecentPosts from '@src/components/common/organisms/posts/RecentPosts'
import { sanityFetch } from '@sanity/utils/fetch'
import { formatAuthor } from '@sanity/utils/formatAuthor'
import { urlForImage } from '@sanity/utils/image'
import { postQuery, postsQuery } from '@sanity/utils/requests'
import { POST } from '@sanity/utils/types'
import Heading from '@components/common/atoms/Heading'

type Props = {
    params: {
        slug: string
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const post = await sanityFetch<POST>({
        query: postQuery,
        params: { slug: params?.slug },
    })
    const previousImages = (await parent).openGraph?.images ?? []
    return {
        title: post?.title ?? '',
        description: post?.excerpt,
        openGraph: {
            title: post?.title,
            description: post?.excerpt,
            images: [
                {
                    url: post?.mainImage ? urlForImage(post?.mainImage) : '',
                    alt: post?.mainImage?.alt ?? '',
                },
                ...previousImages,
            ],
        },
    }
}

export async function generateStaticParams() {
    const posts = await sanityFetch<POST[]>({
        stega: false,
        query: postsQuery,
        perspective: 'published',
    })

    return posts.map((post) => ({
        slug: post.slug?.current,
    }))
}

async function Blog({ params }: { params: QueryParams }) {
    const slug = params?.slug

    if (!slug) return null

    const post = await sanityFetch<POST>({
        query: postQuery,
        params: { slug },
    })

    if (!post) {
        return notFound()
    }

    const imageUrl = post?.mainImage ? urlForImage(post?.mainImage) : ''
    const recentPosts = post?.recentPosts ?? []

    return (
        <div className='min-h-screen py-6 lg:py-12 md:px-4 xl:px-0'>
            <div className='relative mx-auto gap-6 flex flex-col max-w-screen-2xl items-start justify-between lg:gap-x-12 lg:flex-row'>
                <div className='hidden sticky w-full left-0 top-28 z-10 h-96 rounded lg:block lg:w-1/5'>
                    <ContentHeadingReader body={post?.body} />
                    <Share title={post?.title} />
                </div>
                <div className='mx-auto w-full max-w-screen-2xl space-y-5 lg:w-1/2'>
                    <div className='space-y-2 px-4 lg:px-0'>
                        <BreadCrumbs />
                        <Heading>{post?.title}</Heading>
                        <AuthorCard
                            hideDetails={true}
                            author={post?.author}
                            date={new Date(post?.publishedAt).toDateString()}
                            readTime={post?.readTime}
                            hideCoAuthor={false}
                        />
                    </div>
                    {post?.mainImage ? (
                        <ImageWithModal
                            src={imageUrl}
                            showDialog={false}
                            alt={post?.mainImage.alt || ''}
                            caption={post.mainImage.alt || ''}
                        />
                    ) : null}
                    <div className='space-y-6 px-4 lg:px-0'>
                        <ContentReader content={post?.body} />
                        <div className='lg:hidden'>
                            <Share title={post?.title} />
                        </div>
                    </div>
                </div>
                <div className='w-full px-4 left-0 top-24 z-10 h-fit space-y-6 lg:sticky lg:px-2 lg:w-1/4'>
                    <AboutAuthor author={formatAuthor(post?.author[0])} />
                    <RecentPosts posts={recentPosts} />
                </div>
            </div>
        </div>
    )
}

export default Blog
