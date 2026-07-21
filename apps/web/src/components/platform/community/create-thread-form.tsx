'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { Loader2 } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Textarea } from '@repo/ui/components/textarea'
import { trpc } from '@/trpc/react'
import { BlogPostSelect } from './blog-post-select'

type Doc = { id: string; name: string; slug: string | null }

export function CreateThreadForm() {
    const router = useRouter()
    const [datasetParam] = useQueryState('dataset', { defaultValue: '' })
    const [blogIdParam] = useQueryState('blogId', { defaultValue: '' })
    const [blogSlugParam] = useQueryState('blogSlug', { defaultValue: '' })
    const [blogTitleParam] = useQueryState('blogTitle', { defaultValue: '' })

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [sourceType, setSourceType] = useState<'none' | 'dataset' | 'blog'>(
        () => (blogIdParam ? 'blog' : 'none'),
    )
    const [datasetId, setDatasetId] = useState('')
    const [datasetName, setDatasetName] = useState('')
    const [datasetSlug, setDatasetSlug] = useState('')
    const [blogId, setBlogId] = useState(() => blogIdParam)
    const [blogSlug, setBlogSlug] = useState(() => blogSlugParam)
    const [blogTitle, setBlogTitle] = useState(() => blogTitleParam)
    const { data: documents } = trpc.documents.list.useQuery(undefined)

    useEffect(() => {
        if (!datasetParam || !documents || datasetId) return
        const doc = (documents as Doc[]).find(
            (d) => d.slug === datasetParam || d.name === datasetParam,
        )
        if (doc) {
            setSourceType('dataset')
            setDatasetId(doc.id)
            setDatasetName(doc.name)
            setDatasetSlug(doc.slug ?? '')
        }
    }, [datasetParam, documents, datasetId])

    const createThread = trpc.community.createThread.useMutation()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim() || !body.trim()) return
        createThread.mutate(
            {
                title: title.trim(),
                body: body.trim(),
                linkedDatasetId:
                    sourceType === 'dataset' && datasetId
                        ? datasetId
                        : undefined,
                linkedDatasetSlug:
                    sourceType === 'dataset' && datasetSlug
                        ? datasetSlug
                        : undefined,
                linkedDatasetName:
                    sourceType === 'dataset' && datasetName
                        ? datasetName
                        : undefined,
                linkedBlogId:
                    sourceType === 'blog' && blogId ? blogId : undefined,
                linkedBlogSlug:
                    sourceType === 'blog' && blogSlug ? blogSlug : undefined,
                linkedBlogTitle:
                    sourceType === 'blog' && blogTitle ? blogTitle : undefined,
            },
            {
                onSuccess: (thread) => {
                    if (!thread) return
                    router.push(
                        `/community/discussions/${thread.slug ?? thread.id}`,
                    )
                },
            },
        )
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
                <label
                    htmlFor='title'
                    className='text-sm font-medium text-foreground'>
                    Title
                </label>
                <Input
                    id='title'
                    placeholder='What would you like to discuss?'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    required
                />
                <p className='text-xs text-muted-foreground text-right'>
                    {title.length}/200
                </p>
            </div>

            <div className='space-y-2'>
                <label
                    htmlFor='body'
                    className='text-sm font-medium text-foreground'>
                    Discussion
                </label>
                <Textarea
                    id='body'
                    placeholder='Share your thoughts, questions, or insights…'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className='resize-none'
                    required
                />
            </div>

            {/* Source link */}
            <div className='space-y-3'>
                <p className='text-sm font-medium text-foreground'>
                    Link to source (optional)
                </p>
                <div className='flex gap-4'>
                    {(['none', 'dataset', 'blog'] as const).map((type) => (
                        <label
                            key={type}
                            className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='radio'
                                name='sourceType'
                                value={type}
                                checked={sourceType === type}
                                onChange={() => setSourceType(type)}
                                className='accent-primary'
                            />
                            <span className='text-sm'>
                                {type === 'none'
                                    ? 'No link'
                                    : type === 'dataset'
                                      ? 'Dataset'
                                      : 'Blog post'}
                            </span>
                        </label>
                    ))}
                </div>

                {sourceType === 'dataset' && (
                    <div className='space-y-2'>
                        <label
                            htmlFor='dataset-select'
                            className='text-xs text-muted-foreground'>
                            Select dataset
                        </label>
                        <select
                            id='dataset-select'
                            className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                            value={datasetId}
                            onChange={(e) => {
                                const selected = (
                                    documents as Doc[] | undefined
                                )?.find((d) => d.id === e.target.value)
                                setDatasetId(e.target.value)
                                setDatasetName(selected?.name ?? '')
                                setDatasetSlug(selected?.slug ?? '')
                            }}>
                            <option value=''>Choose a dataset…</option>
                            {(documents as Doc[] | undefined)?.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {sourceType === 'blog' && (
                    <BlogPostSelect
                        selectedId={blogId}
                        onChange={(post) => {
                            setBlogId(post?.id ?? '')
                            setBlogSlug(post?.slug ?? '')
                            setBlogTitle(post?.title ?? '')
                        }}
                    />
                )}
            </div>

            {createThread.error && (
                <p className='text-sm text-destructive'>
                    {createThread.error.message}
                </p>
            )}

            <Button
                type='submit'
                disabled={
                    createThread.isPending || !title.trim() || !body.trim()
                }>
                {createThread.isPending ? (
                    <>
                        <Loader2 size={14} className='animate-spin' />
                        Posting…
                    </>
                ) : (
                    'Post discussion'
                )}
            </Button>
        </form>
    )
}
