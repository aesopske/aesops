'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Loader2, SlidersHorizontal } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useDebounce } from '@repo/ui/hooks/use-debounce'
import { Button } from '@repo/ui/components/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from '@repo/ui/components/drawer'
import { trpc } from '@/trpc/react'
import { ThreadCard } from './thread-card'
import {
    DiscussionFilters,
    type Recency,
    type Source,
    type Sort,
} from './discussion-filters'

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

type DatasetOption = { id: string; name: string }

export function DiscussionBrowser({
    initialThreads,
}: {
    initialThreads: Thread[]
}) {
    const [query, setQuery] = useQueryState('q', {
        defaultValue: '',
        shallow: false,
    })
    const [recency, setRecency] = useQueryState('recency', {
        defaultValue: 'all',
        shallow: false,
    })
    const [source, setSource] = useQueryState('source', {
        defaultValue: 'all',
        shallow: false,
    })
    const [dataset, setDataset] = useQueryState('dataset', {
        defaultValue: '',
        shallow: false,
    })
    const [sort, setSort] = useQueryState('sort', {
        defaultValue: 'newest',
        shallow: false,
    })

    const debouncedQuery = useDebounce(query, 400, 3)

    const [threads, setThreads] = useState<Thread[]>(initialThreads)
    const [hasMore, setHasMore] = useState(initialThreads.length >= 20)
    const [isLoading, setIsLoading] = useState(false)
    const utils = trpc.useUtils()

    const { data: documents } = trpc.documents.list.useQuery(undefined)
    const datasetOptions: DatasetOption[] =
        (documents as DatasetOption[] | undefined)?.map((d) => ({
            id: d.id,
            name: d.name,
        })) ?? []

    const filterArgs = {
        query: debouncedQuery || undefined,
        source: source as Source,
        datasetId: dataset || undefined,
        recency: recency as Recency,
        sort: sort as Sort,
    }

    const isDefault =
        !debouncedQuery &&
        recency === 'all' &&
        source === 'all' &&
        !dataset &&
        sort === 'newest'

    const firstRun = useRef(true)

    useEffect(() => {
        // On first mount with default filters, keep the server-seeded list.
        if (firstRun.current) {
            firstRun.current = false
            if (isDefault) return
        }

        let cancelled = false
        setIsLoading(true)
        utils.community.listThreads
            .fetch({ ...filterArgs, limit: 20, offset: 0 })
            .then((result) => {
                if (cancelled) return
                setThreads(result.items as Thread[])
                setHasMore(result.nextOffset !== null)
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, recency, source, dataset, sort])

    async function loadMore() {
        if (isLoading) return
        setIsLoading(true)
        try {
            const result = await utils.community.listThreads.fetch({
                ...filterArgs,
                limit: 20,
                offset: threads.length,
            })
            setThreads((prev) => [...prev, ...(result.items as Thread[])])
            setHasMore(result.nextOffset !== null)
        } finally {
            setIsLoading(false)
        }
    }

    const activeCount =
        (debouncedQuery ? 1 : 0) +
        (recency !== 'all' ? 1 : 0) +
        (source !== 'all' ? 1 : 0) +
        (dataset ? 1 : 0) +
        (sort !== 'newest' ? 1 : 0)

    function reset() {
        setQuery(null)
        setRecency(null)
        setSource(null)
        setDataset(null)
        setSort(null)
    }

    const filtersProps = {
        recency: recency as Recency,
        source: source as Source,
        dataset,
        sort: sort as Sort,
        datasetOptions,
        activeCount,
        onRecencyChange: (v: Recency) => setRecency(v === 'all' ? null : v),
        onSourceChange: (v: Source) => setSource(v === 'all' ? null : v),
        onDatasetChange: (v: string) => setDataset(v || null),
        onSortChange: (v: Sort) => setSort(v === 'newest' ? null : v),
        onReset: reset,
    }

    return (
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start'>
            {/* Left — search + filters */}
            <aside className='space-y-4 lg:sticky lg:top-[4.5rem] lg:w-72 lg:shrink-0'>
                <div className='space-y-1.5'>
                    <label
                        htmlFor='discussion-search'
                        className='px-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
                        Search discussions
                    </label>
                    <div className='relative'>
                        <div className='pointer-events-none absolute inset-y-0 left-3 flex items-center'>
                            <Search
                                size={14}
                                className='text-muted-foreground'
                            />
                        </div>
                        <input
                            id='discussion-search'
                            type='search'
                            placeholder='Search discussions…'
                            value={query}
                            onChange={(e) => setQuery(e.target.value || null)}
                            className='h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20'
                        />
                    </div>
                </div>

                <div className='flex items-center justify-between'>
                    <p className='px-0.5 text-xs text-muted-foreground'>
                        <span className='font-semibold text-primary'>
                            {threads.length}
                        </span>
                        {hasMore ? '+' : ''} discussion
                        {threads.length !== 1 ? 's' : ''}
                    </p>

                    {/* Mobile/tablet — filters live in a drawer */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                className='gap-2 lg:hidden'>
                                <SlidersHorizontal size={13} />
                                Filters
                                {activeCount > 0 && (
                                    <span className='flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground'>
                                        {activeCount}
                                    </span>
                                )}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className='lg:hidden'>
                            <DrawerTitle className='sr-only'>
                                Filter discussions
                            </DrawerTitle>
                            <div className='max-h-[65vh] overflow-y-auto px-4 pt-4 pb-2'>
                                <DiscussionFilters {...filtersProps} bare />
                            </div>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button variant='default'>
                                        Show results
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>

                {/* Desktop — filters sit inline in the sidebar */}
                <div className='hidden lg:block'>
                    <DiscussionFilters {...filtersProps} />
                </div>
            </aside>

            {/* Right — results */}
            <div className='min-w-0 flex-1'>
                {threads.length === 0 ? (
                    <div className='flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center gap-2'>
                        <p className='text-sm text-muted-foreground'>
                            {activeCount > 0
                                ? 'No discussions match your filters.'
                                : 'No discussions yet.'}
                        </p>
                        {activeCount > 0 && (
                            <button
                                type='button'
                                onClick={reset}
                                className='text-xs font-medium text-primary hover:underline underline-offset-2'>
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {threads.map((thread) => (
                            <ThreadCard key={thread.id} thread={thread} />
                        ))}

                        {hasMore && (
                            <div className='flex justify-center pt-4'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={loadMore}
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={14}
                                                className='animate-spin'
                                            />
                                            Loading…
                                        </>
                                    ) : (
                                        'Load more'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
