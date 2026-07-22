'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { Loader2, Sparkles, Send } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { trpc } from '@/trpc/react'
import { RichTextEditor } from '@/components/shared/rich-text-editor'
import type { Comment, EntityType } from './comment-thread'

type Props = {
    entityType: EntityType
    entityId: string
    isLoggedIn: boolean
    currentPath: string
    aiMentions: boolean
    parentId?: string | null
    autoFocus?: boolean
    onCancel?: () => void
    onCommentAdded: (comment: Comment) => void
    onAiCommentAdded: (comment: Comment) => void
    onAiPendingChange?: (commentId: string, isPending: boolean) => void
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, '').trim()
}

function processMentions(html: string) {
    // Avoid double-wrapping when TipTap autocomplete already emitted <code>@aisops</code>
    return html.replace(/<code>@aisops<\/code>|@aisops/gi, (match) =>
        match.startsWith('<code>') ? match : '<code>@aisops</code>',
    )
}

export function CommentForm({
    entityType,
    entityId,
    isLoggedIn,
    currentPath,
    aiMentions,
    parentId,
    autoFocus,
    onCancel,
    onCommentAdded,
    onAiCommentAdded,
    onAiPendingChange,
}: Props) {
    const [html, setHtml] = useState('')
    const [isEmpty, setIsEmpty] = useState(true)
    const [isAiPending, setIsAiPending] = useState(false)
    const [mentionHint, setMentionHint] = useState(false)
    const editorRef = useRef<Editor | null>(null)

    const createComment = trpc.comments.create.useMutation()

    useEffect(() => {
        if (!autoFocus) return
        const id = setTimeout(() => editorRef.current?.commands.focus(), 50)
        return () => clearTimeout(id)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function handleEditorChange(newHtml: string, editorIsEmpty: boolean) {
        setHtml(newHtml)
        setIsEmpty(editorIsEmpty)
        if (!aiMentions) return
        const text = stripHtml(newHtml)
        setMentionHint(/@(aesops(-ai?)?)?$/i.test(text))
    }

    function completeMention() {
        const editor = editorRef.current
        if (!editor) return
        editor
            .chain()
            .focus()
            .command(({ tr, state }) => {
                if (!(state.selection instanceof TextSelection)) return false
                const cursor = state.selection.$cursor
                if (!cursor) return false
                const text = cursor.nodeBefore?.textContent ?? ''
                const match = text.match(/@(aesops(-ai?)?)?$/i)
                if (!match) return false
                const from = cursor.pos - match[0].length
                const codeMark = state.schema.marks.code?.create()
                const mentionNode = codeMark
                    ? state.schema.text('@aisops', [codeMark])
                    : state.schema.text('@aisops')
                tr.replaceWith(from, cursor.pos, [
                    mentionNode,
                    state.schema.text(' '),
                ])
                return true
            })
            .run()
        setMentionHint(false)
    }

    async function handleSuccess(newComment: Comment, savedHtml: string) {
        onCommentAdded(newComment)
        editorRef.current?.commands.clearContent(true)
        setHtml('')
        setIsEmpty(true)
        setMentionHint(false)

        if (aiMentions && /@aisops/i.test(savedHtml)) {
            setIsAiPending(true)
            onAiPendingChange?.(newComment.id, true)
            try {
                const res = await fetch('/api/ai/comment-reply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        entityType,
                        entityId,
                        commentId: newComment.id,
                    }),
                })
                if (res.ok && res.body) {
                    const reader = res.body.getReader()
                    const decoder = new TextDecoder()
                    let aiText = ''
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break
                        const chunk = decoder.decode(value)
                        for (const line of chunk.split('\n')) {
                            if (line.startsWith('0:')) {
                                try {
                                    aiText += JSON.parse(line.slice(2))
                                } catch {
                                    // ignore malformed stream chunks
                                }
                            }
                        }
                    }
                    if (aiText) {
                        onAiCommentAdded({
                            id: `ai-${Date.now()}`,
                            body: aiText,
                            parentId: newComment.id,
                            isAiResponse: true,
                            createdAt: new Date(),
                            userId: null,
                            authorName: 'Aisops',
                            authorImage: null,
                            authorUsername: null,
                            voteScore: 0,
                            userVote: null,
                        })
                    }
                }
            } catch (err) {
                console.error('[comment-form] AI reply error:', err)
            } finally {
                setIsAiPending(false)
                onAiPendingChange?.(newComment.id, false)
            }
        }
    }

    function submit() {
        if (isEmpty || createComment.isPending || isAiPending) return
        const processed = aiMentions ? processMentions(html) : html
        createComment.mutate(
            {
                entityType,
                entityId,
                body: processed,
                parentId: parentId ?? undefined,
            },
            {
                onSuccess: (c: unknown) =>
                    handleSuccess(c as Comment, processed),
            },
        )
    }

    if (!isLoggedIn) {
        return (
            <div className='rounded-lg border border-border bg-muted/30 p-5 text-center'>
                <p className='text-sm text-muted-foreground mb-3'>
                    Sign in to join the conversation
                </p>
                <div className='flex items-center justify-center gap-3'>
                    <Button asChild size='sm' variant='default'>
                        <Link href={`/sign-in?from=${currentPath}`}>
                            Sign in
                        </Link>
                    </Button>
                    <Button asChild size='sm' variant='outline'>
                        <Link href={`/sign-up?from=${currentPath}`}>
                            Create account
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const hasAiMention = aiMentions && /@aisops/i.test(html)
    const placeholder = aiMentions
        ? 'Write a comment… mention @aisops to ask the AI'
        : 'Write a comment…'
    const isReply = !!parentId

    return (
        <div className='space-y-2'>
            <div className='relative'>
                <RichTextEditor
                    placeholder={placeholder}
                    minHeight='min-h-[80px]'
                    allowCode={aiMentions}
                    onChangeHtml={handleEditorChange}
                    onCmdEnter={submit}
                    editorRef={editorRef}
                />
                {mentionHint && (
                    <button
                        type='button'
                        onMouseDown={(e) => {
                            e.preventDefault()
                            completeMention()
                        }}
                        className='absolute bottom-2 left-2 z-10 flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-sm hover:border-primary/50 hover:text-primary transition-colors'>
                        <Sparkles size={11} className='text-primary' />
                        @aisops
                        <span className='ml-1 text-[10px] text-muted-foreground'>
                            Tab
                        </span>
                    </button>
                )}
            </div>

            <div className='flex items-center justify-between'>
                {hasAiMention && (
                    <span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <Sparkles size={11} className='text-primary' />
                        Aisops will respond
                    </span>
                )}
                <div className='ml-auto flex items-center gap-2'>
                    {onCancel && (
                        <Button variant='ghost' size='sm' onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <span className='text-[11px] text-muted-foreground'>
                        ⌘↵ to send
                    </span>
                    <Button
                        size='sm'
                        disabled={
                            isEmpty || createComment.isPending || isAiPending
                        }
                        onClick={submit}>
                        {createComment.isPending || isAiPending ? (
                            <Loader2 size={13} className='animate-spin' />
                        ) : (
                            <Send size={13} />
                        )}
                        {isAiPending
                            ? 'AI is thinking…'
                            : isReply
                              ? 'Reply'
                              : 'Comment'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
