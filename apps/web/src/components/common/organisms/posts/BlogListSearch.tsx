'use client'

import React, { useState } from 'react'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { MIN_POST } from '~sanity/utils/types'
import PostListItem from './PostListItem'

const PAGE_SIZE = 8

type BlogListSearchProps = {
    posts: MIN_POST[]
    heading?: string
    description?: string
}

function BlogListSearch({ posts, heading, description }: BlogListSearchProps) {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const filtered = posts.filter((post) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
            post.title?.toLowerCase().includes(q) ||
            post.excerpt?.toLowerCase().includes(q) ||
            post.categories?.some((c) => c.title?.toLowerCase().includes(q))
        )
    })

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleSearch = (val: string) => {
        setQuery(val)
        setPage(1)
    }

    return (
        <div className='flex flex-col gap-8'>
            {/* Header + Search row */}
            <div className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
                <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                        <div className='w-5 h-px bg-primary' />
                        <span className='text-[10px] font-mono font-medium tracking-[0.22em] uppercase text-primary'>
                            Archive
                        </span>
                    </div>
                    <h2 className='font-sans font-black tracking-tight text-foreground text-3xl md:text-4xl'>
                        {heading ?? 'All Posts'}
                    </h2>
                    {description && (
                        <p className='text-muted-foreground text-sm font-sans leading-relaxed max-w-md'>
                            {description}
                        </p>
                    )}
                </div>

                <div className='relative w-full sm:w-72 shrink-0'>
                    <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none' />
                    <input
                        type='search'
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder='Search posts…'
                        className='w-full pl-9 pr-9 py-2.5 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200'
                    />
                    {query && (
                        <button
                            onClick={() => handleSearch('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors duration-150'>
                            <X className='w-3.5 h-3.5' />
                        </button>
                    )}
                </div>
            </div>

            {/* Results meta */}
            {query.trim() && (
                <div className='flex items-center gap-2 -mt-2'>
                    <span className='text-xs font-mono text-muted-foreground'>
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''} for
                    </span>
                    <span className='text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded-md'>
                        &ldquo;{query}&rdquo;
                    </span>
                </div>
            )}

            {/* List or empty state */}
            {paginated.length === 0 ? (
                <div className='py-20 flex flex-col items-center gap-3 border border-dashed border-border rounded-2xl'>
                    <span className='text-2xl font-mono text-muted-foreground/30'>∅</span>
                    <p className='text-muted-foreground font-mono text-sm'>
                        No posts match &ldquo;{query}&rdquo;
                    </p>
                    <button
                        onClick={() => handleSearch('')}
                        className='text-xs font-mono text-primary/70 hover:text-primary transition-colors duration-150 mt-1'>
                        Clear search
                    </button>
                </div>
            ) : (
                <div className='flex flex-col'>
                    {paginated.map((post) => (
                        <PostListItem key={post.slug.current} post={post} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-between pt-2 border-t border-border/60'>
                    <span className='text-xs font-mono text-muted-foreground'>
                        Page {page} of {totalPages}
                    </span>
                    <div className='flex items-center gap-1'>
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md border border-border text-foreground hover:border-primary/40 hover:text-primary transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed'>
                            <ChevronLeft className='w-3.5 h-3.5' />
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => Math.abs(p - page) <= 2)
                            .map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 text-xs font-mono rounded-md border transition-all duration-150 ${
                                        p === page
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                    }`}>
                                    {p}
                                </button>
                            ))}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-md border border-border text-foreground hover:border-primary/40 hover:text-primary transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed'>
                            Next
                            <ChevronRight className='w-3.5 h-3.5' />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogListSearch
