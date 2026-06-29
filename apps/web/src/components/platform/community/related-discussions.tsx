'use client'

import Link from 'next/link'
import { MessageSquare, Plus } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { trpc } from '@/trpc/react'

type Props = {
    datasetId: string
    datasetSlug: string | null
    datasetName: string
}

export function RelatedDiscussions({
    datasetId,
    datasetSlug,
    datasetName,
}: Props) {
    const { data: threads, isLoading } =
        trpc.community.listThreadsByDataset.useQuery({
            datasetId,
        })

    const newHref = `/community/discussions/new?dataset=${encodeURIComponent(datasetSlug ?? datasetName)}`

    if (isLoading) {
        return (
            <div className='space-y-2'>
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className='h-8 rounded bg-muted animate-pulse'
                    />
                ))}
            </div>
        )
    }

    return (
        <div className='space-y-3'>
            <div className='flex justify-end'>
                <Button asChild variant='outline' size='sm' className='gap-1.5'>
                    <Link href={newHref}>
                        <Plus size={13} />
                        Start a discussion
                    </Link>
                </Button>
            </div>

            {threads && threads.length > 0 ? (
                <div className='space-y-2'>
                    {threads.map(
                        (thread: {
                            id: string
                            slug: string | null
                            title: string
                            replyCount: number
                            createdAt: Date
                        }) => (
                            <Link
                                key={thread.id}
                                href={`/community/discussions/${thread.slug ?? thread.id}`}
                                className='flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/40 transition-colors group'>
                                <span className='truncate text-foreground group-hover:text-primary transition-colors'>
                                    {thread.title}
                                </span>
                                <div className='flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0'>
                                    <MessageSquare size={11} />
                                    {thread.replyCount}
                                </div>
                            </Link>
                        ),
                    )}
                </div>
            ) : (
                <p className='text-xs text-muted-foreground'>
                    No discussions yet for this dataset.
                </p>
            )}
        </div>
    )
}
