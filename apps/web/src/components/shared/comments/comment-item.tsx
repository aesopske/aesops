'use client'

import {
    Sparkles,
    Trash2,
    Reply,
    ChevronDown,
    ChevronRight,
    ThumbsUp,
    ThumbsDown,
} from 'lucide-react'
import { Streamdown } from 'streamdown'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import { trpc } from '@/trpc/react'
import { timeAgo } from '@/lib/platform/format'
import { highlightMentions } from './mention-pill'
import type { Comment } from './comment-thread'

type Props = {
    comment: Comment
    currentUserId: string | null
    isLoggedIn: boolean
    onDeleted: (commentId: string) => void
    onReply: () => void
    onVote: (value: 1 | -1) => void
    replyCount?: number
    repliesCollapsed?: boolean
    onToggleReplies?: () => void
}

export function CommentItem({
    comment,
    currentUserId,
    isLoggedIn,
    onDeleted,
    onReply,
    onVote,
    replyCount = 0,
    repliesCollapsed = false,
    onToggleReplies,
}: Props) {
    const deleteComment = trpc.comments.delete.useMutation()

    const initials = comment.authorName
        ? comment.authorName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?'

    return (
        <div className='flex gap-3'>
            <div className='flex-shrink-0'>
                {comment.isAiResponse ? (
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                        <Sparkles size={13} />
                    </div>
                ) : (
                    <Avatar className='h-7 w-7'>
                        <AvatarImage
                            src={comment.authorImage ?? undefined}
                            alt={comment.authorName ?? ''}
                        />
                        <AvatarFallback className='text-[10px]'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>

            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs font-medium text-foreground'>
                        {comment.isAiResponse
                            ? 'Aisops'
                            : (comment.authorName ?? 'Anonymous')}
                    </span>
                    <span className='text-[11px] text-muted-foreground'>
                        {timeAgo(comment.createdAt)}
                    </span>
                </div>

                {comment.isAiResponse ? (
                    <div className='prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:my-1 prose-headings:font-medium'>
                        <Streamdown mode='streaming'>
                            {highlightMentions(comment.body)}
                        </Streamdown>
                    </div>
                ) : (
                    <div
                        className='prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-headings:font-medium prose-ul:my-1 prose-ol:my-1'
                        dangerouslySetInnerHTML={{
                            __html: highlightMentions(comment.body),
                        }}
                    />
                )}

                <div className='mt-1 flex items-center gap-0.5'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground'
                        onClick={onReply}>
                        <Reply size={13} />
                        Reply
                    </Button>

                    {!comment.isAiResponse && (
                        <div className='flex items-center'>
                            <Button
                                variant='ghost'
                                size='icon'
                                className={`h-7 w-7 ${comment.userVote === 1 ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                disabled={!isLoggedIn}
                                title={!isLoggedIn ? 'Sign in to vote' : undefined}
                                onClick={() => onVote(1)}>
                                <ThumbsUp size={12} />
                            </Button>
                            <span className={`text-[11px] tabular-nums w-4 text-center leading-none ${comment.userVote === 1 ? 'text-primary' : comment.userVote === -1 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {comment.voteScore}
                            </span>
                            <Button
                                variant='ghost'
                                size='icon'
                                className={`h-7 w-7 ${comment.userVote === -1 ? 'text-destructive hover:text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
                                disabled={!isLoggedIn}
                                title={!isLoggedIn ? 'Sign in to vote' : undefined}
                                onClick={() => onVote(-1)}>
                                <ThumbsDown size={12} />
                            </Button>
                        </div>
                    )}

                    {replyCount > 0 && onToggleReplies && (
                        <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 gap-1 px-2 text-xs text-primary hover:text-primary'
                            onClick={onToggleReplies}>
                            {repliesCollapsed ? (
                                <ChevronRight size={13} />
                            ) : (
                                <ChevronDown size={13} />
                            )}
                            {repliesCollapsed
                                ? `View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`
                                : 'Hide replies'}
                        </Button>
                    )}

                    {!comment.isAiResponse &&
                        currentUserId &&
                        comment.userId === currentUserId && (
                            <Button
                                variant='ghost'
                                size='icon'
                                className='h-7 w-7 text-muted-foreground hover:text-destructive'
                                disabled={deleteComment.isPending}
                                onClick={() =>
                                    deleteComment.mutate(
                                        { commentId: comment.id },
                                        {
                                            onSuccess: () =>
                                                onDeleted(comment.id),
                                        },
                                    )
                                }>
                                <Trash2 size={13} />
                            </Button>
                        )}
                </div>
            </div>
        </div>
    )
}
