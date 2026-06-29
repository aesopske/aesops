'use client'

import { Search } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useDebounce } from '@repo/ui/hooks/use-debounce'
import { trpc } from '@/trpc/react'
import { DatasetCard, type Document } from '../dataset/dataset-card'
import { DatasetListRow } from './dataset-list-row'
import { DatasetPreviewModal } from './dataset-preview-modal'

function SkeletonRow() {
    return (
        <div className='flex animate-pulse items-center gap-4 border-b border-border px-4 py-3.5'>
            <div className='h-8 w-8 shrink-0 rounded-lg bg-muted' />
            <div className='flex-1 space-y-1.5'>
                <div className='h-3.5 w-2/3 rounded bg-muted' />
                <div className='h-3 w-1/3 rounded bg-muted' />
            </div>
            <div className='h-4 w-20 rounded bg-muted' />
            <div className='h-7 w-16 rounded-md bg-muted' />
        </div>
    )
}

function SkeletonCard() {
    return (
        <div className='animate-pulse rounded-xl border border-border bg-card p-4'>
            <div className='flex items-start gap-3'>
                <div className='h-10 w-10 shrink-0 rounded-lg bg-muted' />
                <div className='flex-1 space-y-2'>
                    <div className='h-4 w-3/4 rounded bg-muted' />
                    <div className='h-3 w-1/2 rounded bg-muted' />
                </div>
            </div>
            <div className='mt-3 h-4 w-1/3 rounded bg-muted' />
            <div className='mt-3 flex flex-wrap gap-1.5'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='h-5 w-16 rounded-full bg-muted' />
                ))}
            </div>
        </div>
    )
}

export function DatasetBrowser() {
    const [query, setQuery] = useQueryState('q', {
        defaultValue: '',
        shallow: false,
    })
    const [selectedId, setSelectedId] = useQueryState('id', {
        defaultValue: '',
    })
    const debouncedQuery = useDebounce(query, 400, 3)

    const { data: documents, isLoading } = trpc.documents.list.useQuery(
        debouncedQuery ? { query: debouncedQuery } : undefined,
    )

    const selectedDoc =
        (documents as Document[] | undefined)?.find(
            (d) => d.id === selectedId,
        ) ?? null

    function handlePreview(id: string) {
        setSelectedId(id === selectedId ? null : id)
    }

    return (
        <>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start'>
                {/* Search sidebar — full width on mobile, sidebar on lg+ */}
                <aside className='w-full shrink-0 lg:w-72 lg:sticky lg:top-[4.5rem]'>
                    <div className='space-y-4'>
                        <div className='relative'>
                            <div className='pointer-events-none absolute inset-y-0 left-3 flex items-center'>
                                <Search
                                    size={14}
                                    className='text-muted-foreground'
                                />
                            </div>
                            <input
                                type='search'
                                placeholder='Search datasets…'
                                value={query}
                                onChange={(e) =>
                                    setQuery(e.target.value || null)
                                }
                                className='h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20'
                            />
                        </div>

                        {!isLoading && documents !== undefined && (
                            <div className='space-y-0.5 text-xs text-muted-foreground'>
                                <p>
                                    <span className='font-semibold text-primary'>
                                        {documents.length}
                                    </span>{' '}
                                    dataset
                                    {documents.length !== 1 ? 's' : ''}
                                </p>
                                {debouncedQuery && (
                                    <p className='truncate'>
                                        matching &ldquo;{debouncedQuery}&rdquo;
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Dataset cards — mobile only */}
                <div className='min-w-0 flex-1 lg:hidden'>
                    {isLoading ? (
                        <div className='grid grid-cols-1 gap-4'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : !documents?.length ? (
                        <div className='flex flex-col items-center justify-center rounded-xl border border-border bg-card py-24 text-center'>
                            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                                <Search size={20} className='text-primary' />
                            </div>
                            <p className='font-medium text-foreground'>
                                {debouncedQuery
                                    ? `No results for "${debouncedQuery}"`
                                    : 'No datasets yet'}
                            </p>
                            <p className='mt-1 text-sm text-muted-foreground'>
                                {debouncedQuery
                                    ? 'Try a different search term.'
                                    : 'Be the first to upload a dataset.'}
                            </p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 gap-4'>
                            {(documents as Document[]).map((doc) => (
                                <DatasetCard
                                    key={doc.id}
                                    doc={doc}
                                    selected={doc.id === selectedId}
                                    onPreview={handlePreview}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Dataset list — desktop only */}
                <div className='hidden min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-card lg:block'>
                    {isLoading ? (
                        <div className='divide-y divide-border'>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <SkeletonRow key={i} />
                            ))}
                        </div>
                    ) : !documents?.length ? (
                        <div className='flex flex-col items-center justify-center py-24 text-center'>
                            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                                <Search size={20} className='text-primary' />
                            </div>
                            <p className='font-medium text-foreground'>
                                {debouncedQuery
                                    ? `No results for "${debouncedQuery}"`
                                    : 'No datasets yet'}
                            </p>
                            <p className='mt-1 text-sm text-muted-foreground'>
                                {debouncedQuery
                                    ? 'Try a different search term.'
                                    : 'Be the first to upload a dataset.'}
                            </p>
                        </div>
                    ) : (
                        <div className='divide-y divide-border'>
                            {(documents as Document[]).map((doc) => (
                                <DatasetListRow
                                    key={doc.id}
                                    doc={doc}
                                    selected={doc.id === selectedId}
                                    onPreviewAction={handlePreview}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <DatasetPreviewModal
                doc={selectedDoc}
                onCloseAction={() => setSelectedId(null)}
            />
        </>
    )
}
