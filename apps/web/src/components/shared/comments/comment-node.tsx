'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { CommentItem } from './comment-item'
import { AiReplyTyping } from './ai-reply-typing'
import type { Comment } from './comment-thread'

const MAX_INDENT_DEPTH = 4

type Props = {
    comment: Comment
    childrenMap: Map<string | null, Comment[]>
    depth: number
    currentUserId: string | null
    isLoggedIn: boolean
    onDeleted: (commentId: string) => void
    onReply: (comment: Comment) => void
    onVote: (commentId: string, value: 1 | -1) => void
    renderReplyForm: (commentId: string) => ReactNode
    pendingAiReplyIds: Set<string>
}

export function CommentNode({
    comment,
    childrenMap,
    depth,
    currentUserId,
    isLoggedIn,
    onDeleted,
    onReply,
    onVote,
    renderReplyForm,
    pendingAiReplyIds,
}: Props) {
    const children = childrenMap.get(comment.id) ?? []
    const [collapsed, setCollapsed] = useState(false)

    const indentChildren = depth < MAX_INDENT_DEPTH

    return (
        <div>
            <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                isLoggedIn={isLoggedIn}
                onDeleted={onDeleted}
                onReply={() => onReply(comment)}
                onVote={(value) => onVote(comment.id, value)}
                replyCount={children.length}
                repliesCollapsed={collapsed}
                onToggleReplies={() => setCollapsed((c) => !c)}
            />

            {pendingAiReplyIds.has(comment.id) && <AiReplyTyping />}

            {renderReplyForm(comment.id)}

            {children.length > 0 && !collapsed && (
                <div
                    className={
                        indentChildren
                            ? 'mt-3 ml-3.5 space-y-4 border-l-2 border-border/70 pl-4 sm:ml-10 sm:pl-4'
                            : 'mt-3 space-y-4'
                    }>
                    {children.map((child) => (
                        <CommentNode
                            key={child.id}
                            comment={child}
                            childrenMap={childrenMap}
                            depth={depth + 1}
                            currentUserId={currentUserId}
                            isLoggedIn={isLoggedIn}
                            onDeleted={onDeleted}
                            onReply={onReply}
                            onVote={onVote}
                            renderReplyForm={renderReplyForm}
                            pendingAiReplyIds={pendingAiReplyIds}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
