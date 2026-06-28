import { draftMode, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import { groq } from 'next-sanity'
import { auth } from '@repo/auth'
import { api } from '@/trpc/server'
import PageBuilder from '@components/common/PageBuilder'
import BlogPageDetail from '@components/common/organisms/posts/BlogPageDetail'
import { sanityFetch } from '~sanity/utils/fetch'
import { client } from '~sanity/utils/client'
import { urlForImage } from '~sanity/utils/image'
import { pageMetadataQuery, pageQuery } from '~sanity/utils/requests'
import { HOME_PAGE, PAGE } from '~sanity/utils/types'

const HOME_SLUG = 'homepage'

type Props = {
    params: Promise<{ slug?: string[] }>
}

const allPageSlugsQuery = groq`*[_type == 'page' && !(_id in path('drafts.**'))] { "slug": slug.current }`

export async function generateStaticParams() {
    const pages = await client.fetch<{ slug: string }[]>(allPageSlugsQuery)
    return pages.map(({ slug }) => ({
        slug: slug === HOME_SLUG ? [] : slug.split('/'),
    }))
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { slug: slugParts } = await params
    const slug = slugParts?.join('/') ?? HOME_SLUG

    const page = await sanityFetch<PAGE>({
        query: pageMetadataQuery,
        params: { slug },
    })

    const previousImages = (await parent).openGraph?.images || []
    const ogImageSrc = page?.ogimage ?? page?.mainImage
    const pageOgImage = ogImageSrc ? urlForImage(ogImageSrc) : null
    const isBlog = page?.pageType === 'blog'

    return {
        title: isBlog
            ? page?.title
            : (page?.seoTitle ?? 'Aesops - Unveiling Insights'),
        description: isBlog
            ? (page?.excerpt ?? '')
            : (page?.seoDescription ??
              'Are you looking to get insights for your data and make data-driven decisions? Aesops is a pioneering data organisation based in Kenya, dedicated to revolutionising the data sector in the country.'),
        openGraph: {
            title: isBlog ? page?.title : page?.seoTitle,
            description: isBlog ? page?.excerpt : page?.seoDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}${slug === HOME_SLUG ? '' : `/${slug}`}`,
            images: [...(pageOgImage ? [pageOgImage] : []), ...previousImages],
        },
    }
}

async function Page({ params }: Props) {
    const { isEnabled } = await draftMode()
    const { slug: slugParts } = await params
    const slug = slugParts?.join('/') ?? HOME_SLUG

    const page = await sanityFetch<HOME_PAGE>({
        query: pageQuery,
        draftMode: isEnabled,
        params: { slug },
    })

    if (!page) notFound()

    if ((page as unknown as PAGE).pageType === 'blog') {
        const blog = page as unknown as PAGE
        const session = await auth.api.getSession({ headers: await headers() })
        const comments = await api.comments
            .list({ entityType: 'blog', entityId: blog._id, currentUserId: session?.user.id })
            .catch(() => [])
        return (
            <BlogPageDetail
                page={blog}
                comments={comments}
                isLoggedIn={!!session}
                currentUserId={session?.user.id ?? null}
                currentPath={`/${slug}`}
            />
        )
    }

    return (
        <div className='w-full h-full min-h-screen'>
            {page?.sections && <PageBuilder blocks={page.sections} />}
        </div>
    )
}

export default Page
