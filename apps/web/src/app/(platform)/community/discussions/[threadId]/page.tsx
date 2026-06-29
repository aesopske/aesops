import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'
import { api } from '@/trpc/server'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { CommentThread } from '@/components/shared/comments/comment-thread'
import { ThreadSourceBadge } from '@/components/platform/community/thread-source-badge'
import { ThreadDeleteButton } from '@/components/platform/community/thread-delete-button'
import { timeAgo } from '@/lib/platform/format'
import { Metadata } from 'next'

type Props = { params: Promise<{ threadId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { threadId } = await params
    try {
        const { thread } = await api.community.getThread({ threadId })
        return { title: `${thread.title} · Aesops Community` }
    } catch {
        return { title: 'Discussion · Aesops Community' }
    }
}

export default async function ThreadPage({ params }: Props) {
    const { threadId } = await params

    const [session, data] = await Promise.all([
        auth.api.getSession({ headers: await headers() }),
        api.community.getThread({ threadId }).catch(() => null),
    ])

    if (!data) notFound()
    const { thread } = data

    const comments = await api.comments
        .list({ entityType: 'discussion', entityId: thread.id, currentUserId: session?.user.id })
        .catch(() => [])
    const isOwner = !!session && thread.userId === session.user.id

    const initials = thread.authorName
        ? thread.authorName
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?'

    return (
        <main className='flex flex-col'>
            {/* Hero */}
            <section className='relative flex-none overflow-hidden bg-primary'>
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />

                <div className='relative z-10 mx-auto max-w-6xl px-6 py-10 lg:py-14'>
                    <BreadCrumbs color='light' className='mb-8' />

                    <div className='flex items-start justify-between gap-4'>
                        <h1 className='font-sans font-light text-3xl md:text-4xl tracking-tight leading-[1.15] text-primary-foreground'>
                            {thread.title}
                        </h1>
                        {isOwner && <ThreadDeleteButton threadId={thread.id} />}
                    </div>

                    <div className='mt-4'>
                        <ThreadSourceBadge
                            linkedDatasetId={thread.linkedDatasetId}
                            linkedDatasetSlug={thread.linkedDatasetSlug}
                            linkedDatasetName={thread.linkedDatasetName}
                            linkedBlogId={thread.linkedBlogId}
                            linkedBlogSlug={thread.linkedBlogSlug}
                            linkedBlogTitle={thread.linkedBlogTitle}
                            variant='dark'
                        />
                    </div>

                    <p className='mt-5 text-sm text-primary-foreground/75 whitespace-pre-wrap leading-relaxed max-w-2xl'>
                        {thread.body}
                    </p>

                    <div className='mt-6 flex items-center gap-2'>
                        <Avatar className='h-6 w-6'>
                            <AvatarImage
                                src={thread.authorImage ?? undefined}
                                alt={thread.authorName ?? ''}
                            />
                            <AvatarFallback className='text-[10px] bg-primary-foreground/20 text-primary-foreground'>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className='text-xs text-primary-foreground/55'>
                            {thread.authorName ?? 'Anonymous'} ·{' '}
                            {timeAgo(thread.createdAt)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Replies */}
            <div className='mx-auto w-full max-w-6xl px-6 py-10'>
                <CommentThread
                    entityType='discussion'
                    entityId={thread.id}
                    initialComments={comments}
                    isLoggedIn={!!session}
                    currentUserId={session?.user.id ?? null}
                    currentPath={`/community/discussions/${thread.slug ?? thread.id}`}
                    aiMentions
                />
            </div>
        </main>
    )
}
