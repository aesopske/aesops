'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { timeAgo } from '@/lib/platform/format'
import { ThreadSourceBadge } from './thread-source-badge'

type Thread = {
    id: string
    slug: string | null
    title: string
    body: string
    replyCount: number
    createdAt: Date
    authorName: string | null
    authorImage: string | null
    linkedDatasetId: string | null
    linkedDatasetSlug: string | null
    linkedDatasetName: string | null
    linkedBlogId: string | null
    linkedBlogSlug: string | null
    linkedBlogTitle: string | null
}

export function ThreadCard({ thread }: { thread: Thread }) {
    const initials = thread.authorName
        ? thread.authorName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?'

    return (
        <Link
            href={`/community/discussions/${thread.slug ?? thread.id}`}
            className='block group rounded-lg border border-border bg-card p-5 hover:border-primary/40 transition-colors'>
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0 flex-1 space-y-1.5'>
                    <h3 className='font-medium text-md text-foreground group-hover:text-primary transition-colors line-clamp-2'>
                        {thread.title}
                    </h3>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                        {thread.body}
                    </p>
                    <ThreadSourceBadge
                        static
                        linkedDatasetId={thread.linkedDatasetId}
                        linkedDatasetSlug={thread.linkedDatasetSlug}
                        linkedDatasetName={thread.linkedDatasetName}
                        linkedBlogId={thread.linkedBlogId}
                        linkedBlogSlug={thread.linkedBlogSlug}
                        linkedBlogTitle={thread.linkedBlogTitle}
                    />
                </div>
            </div>

            <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar className='h-5 w-5'>
                        <AvatarImage
                            src={thread.authorImage ?? undefined}
                            alt={thread.authorName ?? ''}
                        />
                        <AvatarFallback className='text-[10px]'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className='text-xs text-muted-foreground'>
                        {thread.authorName ?? 'Anonymous'} ·{' '}
                        {timeAgo(thread.createdAt)}
                    </span>
                </div>
                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                    <MessageSquare size={12} />
                    <span>{thread.replyCount}</span>
                </div>
            </div>
        </Link>
    )
}
