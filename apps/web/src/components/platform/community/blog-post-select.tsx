'use client'

import { trpc } from '@/trpc/react'

export type BlogPostSelection = {
    id: string
    slug: string
    title: string
}

type Post = BlogPostSelection

type Props = {
    selectedId: string
    onChange: (post: BlogPostSelection | null) => void
}

export function BlogPostSelect({ selectedId, onChange }: Props) {
    const { data: posts, isLoading } =
        trpc.community.listBlogPosts.useQuery(undefined)

    return (
        <select
            className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50'
            value={selectedId ?? ''}
            disabled={isLoading}
            onChange={(e) => {
                const post = posts?.find((p: Post) => p.id === e.target.value)
                onChange(post ?? null)
            }}>
            <option value=''>
                {isLoading ? 'Loading posts…' : 'Choose a blog post…'}
            </option>
            {posts?.map((post: Post) => (
                <option key={post.id} value={post.id}>
                    {post.title}
                </option>
            ))}
        </select>
    )
}
