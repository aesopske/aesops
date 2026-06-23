import Image from 'next/image'
import Link from 'next/link'
import { Clock, MessageSquare } from 'lucide-react'
import ContentReader from '@components/common/ContentReader'
import ContentHeadingReader from '@components/common/ContentHeadingReader'
import Share from '@components/common/ShareBtns'
import {
    CommentThread,
    type Comment,
} from '@components/shared/comments/comment-thread'
import { urlForImage } from '~sanity/utils/image'
import { PAGE } from '~sanity/utils/types'
import BreadCrumbs from '../bread-crumbs/BreadCrumbs'

type Props = {
    page: PAGE
    comments: Comment[]
    isLoggedIn: boolean
    currentUserId: string | null
    currentPath: string
}

function BlogPageDetail({
    page,
    comments,
    isLoggedIn,
    currentUserId,
    currentPath,
}: Props) {
    console.log(page)
    const imageUrl = page.mainImage
        ? (urlForImage(page.mainImage) ?? null)
        : null
    const category = page.categories?.[0]
    const slugTail =
        page.slug?.current
            ?.split('/')
            .pop()
            ?.replace(/[^a-z0-9]/gi, '-') ?? ''
    const titleTransitionName = slugTail ? `post-title-${slugTail}` : undefined

    return (
        <>
            {/* ── Hero header ───────────────────────────────── */}
            <section className='relative bg-primary overflow-hidden'>
                {/* Dot-grid texture */}
                <div
                    className='absolute inset-0 opacity-[0.07]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25' />

                <div className='relative z-10 mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8 pt-8 pb-10 lg:pt-10 lg:pb-14'>
                    <BreadCrumbs color='light' className='mb-8' />

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
                        {/* Left: category · title · meta */}
                        <div className='flex flex-col gap-4'>
                            {category && (
                                <span className='inline-flex items-center gap-2 text-[10px] font-mono font-medium tracking-[0.18em] uppercase text-accent w-fit'>
                                    <span className='w-1.5 h-1.5 rounded-full bg-accent shrink-0' />
                                    {category.title}
                                </span>
                            )}

                            <h1
                                className='font-sans font-light text-3xl lg:text-4xl xl:text-[2.75rem] text-primary-foreground tracking-tight leading-[1.1]'
                                style={{
                                    viewTransitionName: titleTransitionName,
                                }}>
                                {page.title}
                            </h1>

                            <div className='flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-primary-foreground/55 pt-2 border-t border-white/[0.12]'>
                                {page.author?.[0]?.name && (
                                    <span className='text-primary-foreground/80 font-medium capitalize font-sans'>
                                        {page.author[0].name}
                                    </span>
                                )}
                                {page.publishedAt && (
                                    <>
                                        <span className='w-1 h-1 rounded-full bg-white/25' />
                                        <span className='font-mono'>
                                            {new Date(
                                                page.publishedAt,
                                            ).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </>
                                )}
                                {page.readTime ? (
                                    <>
                                        <span className='w-1 h-1 rounded-full bg-white/25' />
                                        <span className='flex items-center gap-1 font-mono'>
                                            <Clock className='w-3 h-3' />
                                            {page.readTime} min read
                                        </span>
                                    </>
                                ) : null}
                            </div>

                            <Link
                                href={`/community/discussions/new?blogId=${page._id}&blogSlug=${encodeURIComponent(page.slug?.current ?? '')}&blogTitle=${encodeURIComponent(page.title)}`}
                                className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20'>
                                <MessageSquare size={13} />
                                Start a discussion
                            </Link>
                        </div>

                        {/* Right: cover image */}
                        {imageUrl && (
                            <div className='relative aspect-[16/10] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10'>
                                <Image
                                    src={imageUrl}
                                    alt={page.mainImage?.alt || page.title}
                                    fill
                                    sizes='(max-width: 1024px) 100vw, 50vw'
                                    className='object-cover'
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Article body ──────────────────────────────── */}
            <section className='bg-background py-12 lg:py-16'>
                <div className='mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                    <div className='flex gap-10 lg:gap-16 items-start'>
                        {/* Sticky sidebar: share + TOC */}
                        <aside className='hidden lg:flex flex-col gap-6 sticky top-8 w-64 shrink-0'>
                            <Share title={page.title} />
                            <ContentHeadingReader body={page.body} />
                        </aside>

                        {/* Prose */}
                        <article className='flex-1 min-w-0 space-y-4'>
                            {page.body && <ContentReader content={page.body} />}
                            {/* Mobile share */}
                            <div className='lg:hidden pt-6 mt-6 border-t border-border'>
                                <Share title={page.title} />
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* ── Comments ──────────────────────────────────── */}
            <section className='bg-background pb-16 lg:pb-20'>
                <div className='mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) px-6 lg:px-8'>
                    <div className='border-t border-border pt-10'>
                        <CommentThread
                            entityType='blog'
                            entityId={page._id}
                            initialComments={comments}
                            isLoggedIn={isLoggedIn}
                            currentUserId={currentUserId}
                            currentPath={currentPath}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlogPageDetail
