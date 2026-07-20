'use client'

import { useMemo, useState } from 'react'
import { trpc } from '@/trpc/react'
import { authClient } from '@/lib/auth-client'
import { CommentNode } from './comment-node'
import { CommentForm } from './comment-form'

export type EntityType = 'discussion' | 'blog'

export type Comment = {
    id: string
    body: string
    parentId: string | null
    isAiResponse: boolean
    createdAt: Date
    userId: string | null
    authorName: string | null
    authorImage: string | null
    authorUsername: string | null
    voteScore: number
    userVote: 1 | -1 | null
}

type Props = {
    entityType: EntityType
    entityId: string
    currentPath: string
    // Optional server-seeded data. When omitted (e.g. statically-rendered blog
    // pages), the thread self-fetches comments and derives auth on the client.
    initialComments?: Comment[]
    isLoggedIn?: boolean
    currentUserId?: string | null
    aiMentions?: boolean
}

function buildChildrenMap(items: Comment[]) {
    const map = new Map<string | null, Comment[]>()
    const ids = new Set(items.map((c) => c.id))
    for (const c of items) {
        // treat orphans (parent no longer present) as top-level
        const key = c.parentId && ids.has(c.parentId) ? c.parentId : null
        const arr = map.get(key) ?? []
        arr.push(c)
        map.set(key, arr)
    }
    for (const arr of map.values()) {
        arr.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    }
    return map
}

export function CommentThread({
    entityType,
    entityId,
    initialComments,
    isLoggedIn: isLoggedInProp,
    currentUserId: currentUserIdProp,
    currentPath,
    aiMentions = false,
}: Props) {
    const { data: session } = authClient.useSession()
    const isLoggedIn = isLoggedInProp ?? !!session?.user
    const currentUserId =
        currentUserIdProp !== undefined
            ? currentUserIdProp
            : (session?.user?.id ?? null)

    const listQuery = trpc.comments.list.useQuery(
        {
            entityType,
            entityId,
            currentUserId: currentUserId ?? undefined,
        },
        { initialData: initialComments },
    )

    const [comments, setComments] = useState<Comment[]>(initialComments ?? [])
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
    const [pendingAiReplyIds, setPendingAiReplyIds] = useState<Set<string>>(
        new Set(),
    )

    function handleAiPendingChange(commentId: string, isPending: boolean) {
        setPendingAiReplyIds((prev) => {
            const next = new Set(prev)
            if (isPending) next.add(commentId)
            else next.delete(commentId)
            return next
        })
    }

    // Reconcile local (optimistically-mutated) state with fresh server data.
    // The list query is only refetched on mount/refocus — vote/create/delete
    // mutate local state directly without invalidating it — so this won't clobber
    // in-flight optimistic updates. Adjusting state during render (rather than in
    // an effect) avoids an extra commit each time the query refetches.
    const [syncedData, setSyncedData] = useState(listQuery.data)
    if (listQuery.data !== syncedData) {
        setSyncedData(listQuery.data)
        if (listQuery.data) setComments(listQuery.data)
    }

    const childrenMap = useMemo(() => buildChildrenMap(comments), [comments])
    const topLevel = childrenMap.get(null) ?? []

    const voteMutation = trpc.comments.vote.useMutation()

    function handleVote(commentId: string, value: 1 | -1) {
        // Optimistic update before the round-trip
        setComments((prev) =>
            prev.map((c) => {
                if (c.id !== commentId) return c
                const prevVote = c.userVote
                const newVote = prevVote === value ? null : value
                const scoreDelta =
                    prevVote === value
                        ? -value
                        : prevVote
                          ? value * 2
                          : value
                return {
                    ...c,
                    voteScore: c.voteScore + scoreDelta,
                    userVote: newVote,
                }
            }),
        )

        voteMutation.mutate(
            { commentId, value },
            {
                onSuccess: (data: { voteScore: number; userVote: 1 | -1 | null }) => {
                    setComments((prev) =>
                        prev.map((c) =>
                            c.id === commentId
                                ? { ...c, voteScore: data.voteScore, userVote: data.userVote }
                                : c,
                        ),
                    )
                },
            },
        )
    }

    function handleDeleted(deletedId: string) {
        setComments((prev) => {
            const toRemove = new Set<string>([deletedId])
            let changed = true
            while (changed) {
                changed = false
                for (const c of prev) {
                    if (
                        c.parentId &&
                        toRemove.has(c.parentId) &&
                        !toRemove.has(c.id)
                    ) {
                        toRemove.add(c.id)
                        changed = true
                    }
                }
            }
            return prev.filter((c) => !toRemove.has(c.id))
        })
    }

    function renderReplyForm(commentId: string) {
        if (activeReplyId !== commentId) return null
        return (
            <div className='mt-3 pl-10'>
                <CommentForm
                    entityType={entityType}
                    entityId={entityId}
                    isLoggedIn={isLoggedIn}
                    currentPath={currentPath}
                    aiMentions={aiMentions}
                    parentId={commentId}
                    autoFocus
                    onCancel={() => setActiveReplyId(null)}
                    onCommentAdded={(c) => {
                        setComments((prev) => [...prev, c])
                        setActiveReplyId(null)
                    }}
                    onAiCommentAdded={(c) =>
                        setComments((prev) => [...prev, c])
                    }
                    onAiPendingChange={handleAiPendingChange}
                />
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <h2 className='text-sm font-medium text-foreground'>
                {comments.length === 0
                    ? 'No comments'
                    : `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}
            </h2>

            {topLevel.length > 0 && (
                <div className='space-y-5'>
                    {topLevel.map((comment) => (
                        <CommentNode
                            key={comment.id}
                            comment={comment}
                            childrenMap={childrenMap}
                            depth={0}
                            currentUserId={currentUserId}
                            isLoggedIn={isLoggedIn}
                            onDeleted={handleDeleted}
                            onReply={(c) =>
                                setActiveReplyId(
                                    activeReplyId === c.id ? null : c.id,
                                )
                            }
                            onVote={handleVote}
                            renderReplyForm={renderReplyForm}
                            pendingAiReplyIds={pendingAiReplyIds}
                        />
                    ))}
                </div>
            )}

            <CommentForm
                entityType={entityType}
                entityId={entityId}
                isLoggedIn={isLoggedIn}
                currentPath={currentPath}
                aiMentions={aiMentions}
                onCommentAdded={(c) => setComments((prev) => [...prev, c])}
                onAiCommentAdded={(c) => setComments((prev) => [...prev, c])}
                onAiPendingChange={handleAiPendingChange}
            />
        </div>
    )
}
