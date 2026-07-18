'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
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
import { DatasetCard, type Document } from '../dataset/dataset-card'
import { DatasetListRow } from './dataset-list-row'
import { DatasetPreviewModal } from './dataset-preview-modal'
import { DatasetFiltersPanel } from './dataset-filters-panel'
import { DatasetPagination } from './dataset-pagination'

const PAGE_SIZE = 20
const BYTES_PER_MB = 1024 * 1024

function SkeletonRow() {
    return (
        <div className='flex animate-pulse items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm'>
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
    const [licenseParam, setLicenseParam] = useQueryState('license', {
        defaultValue: '',
    })
    const [minSizeInput, setMinSizeInput] = useQueryState('minSize', {
        defaultValue: '',
    })
    const [maxSizeInput, setMaxSizeInput] = useQueryState('maxSize', {
        defaultValue: '',
    })
    const [minRowsInput, setMinRowsInput] = useQueryState('minRows', {
        defaultValue: '',
    })
    const [maxRowsInput, setMaxRowsInput] = useQueryState('maxRows', {
        defaultValue: '',
    })
    const [pageParam, setPageParam] = useQueryState('page', {
        defaultValue: '1',
    })

    const debouncedQuery = useDebounce(query, 400, 3)
    const debouncedMinSize = useDebounce(minSizeInput, 400)
    const debouncedMaxSize = useDebounce(maxSizeInput, 400)
    const debouncedMinRows = useDebounce(minRowsInput, 400)
    const debouncedMaxRows = useDebounce(maxRowsInput, 400)

    const selectedLicenses = licenseParam ? licenseParam.split(',') : []
    const page = Math.max(1, Number(pageParam) || 1)
    const hasActiveFilters =
        selectedLicenses.length > 0 ||
        !!minSizeInput ||
        !!maxSizeInput ||
        !!minRowsInput ||
        !!maxRowsInput
    const activeFilterCount =
        selectedLicenses.length +
        (minSizeInput ? 1 : 0) +
        (maxSizeInput ? 1 : 0) +
        (minRowsInput ? 1 : 0) +
        (maxRowsInput ? 1 : 0)

    function resetPage() {
        if (pageParam !== '1') setPageParam(null)
    }

    function handleQueryChange(value: string) {
        setQuery(value || null)
        resetPage()
    }

    function handleToggleLicense(value: string) {
        const next = selectedLicenses.includes(value)
            ? selectedLicenses.filter((l) => l !== value)
            : [...selectedLicenses, value]
        setLicenseParam(next.length ? next.join(',') : null)
        resetPage()
    }

    function handleMinSizeChange(value: string) {
        setMinSizeInput(value || null)
        resetPage()
    }
    function handleMaxSizeChange(value: string) {
        setMaxSizeInput(value || null)
        resetPage()
    }
    function handleMinRowsChange(value: string) {
        setMinRowsInput(value || null)
        resetPage()
    }
    function handleMaxRowsChange(value: string) {
        setMaxRowsInput(value || null)
        resetPage()
    }

    function handleClearFilters() {
        setLicenseParam(null)
        setMinSizeInput(null)
        setMaxSizeInput(null)
        setMinRowsInput(null)
        setMaxRowsInput(null)
        resetPage()
    }

    function handlePageChange(nextPage: number) {
        setPageParam(nextPage <= 1 ? null : String(nextPage))
    }

    const { data, isLoading } = trpc.documents.browse.useQuery({
        query: debouncedQuery || undefined,
        license: selectedLicenses.length ? selectedLicenses : undefined,
        minSize: debouncedMinSize
            ? Number(debouncedMinSize) * BYTES_PER_MB
            : undefined,
        maxSize: debouncedMaxSize
            ? Number(debouncedMaxSize) * BYTES_PER_MB
            : undefined,
        minRows: debouncedMinRows ? Number(debouncedMinRows) : undefined,
        maxRows: debouncedMaxRows ? Number(debouncedMaxRows) : undefined,
        page,
        pageSize: PAGE_SIZE,
    })
    const { data: licenseOptions } =
        trpc.documents.distinctLicenses.useQuery(undefined)

    const documents = data?.items
    const total = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const selectedDoc =
        (documents as Document[] | undefined)?.find(
            (d) => d.id === selectedId,
        ) ?? null

    function handlePreview(id: string) {
        setSelectedId(id === selectedId ? null : id)
    }

    const isFiltered = !!debouncedQuery || hasActiveFilters
    const emptyTitle = isFiltered
        ? `No results${debouncedQuery ? ` for "${debouncedQuery}"` : ''}`
        : 'No datasets yet'
    const emptyHint = isFiltered
        ? 'Try a different search term or fewer filters.'
        : 'Be the first to upload a dataset.'

    const filtersProps = {
        licenseOptions: licenseOptions ?? [],
        selectedLicenses,
        onToggleLicense: handleToggleLicense,
        minSize: minSizeInput,
        maxSize: maxSizeInput,
        onMinSizeChange: handleMinSizeChange,
        onMaxSizeChange: handleMaxSizeChange,
        minRows: minRowsInput,
        maxRows: maxRowsInput,
        onMinRowsChange: handleMinRowsChange,
        onMaxRowsChange: handleMaxRowsChange,
        onClear: handleClearFilters,
        hasActiveFilters,
    }

    return (
        <>
            <div className='flex flex-col gap-6'>
                {/* Search bar — full width, top of page */}
                <div className='space-y-1.5'>
                    <label
                        htmlFor='dataset-search'
                        className='px-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
                        Search datasets
                    </label>
                    <div className='flex items-center gap-3'>
                        <div className='relative max-w-md flex-1'>
                            <div className='pointer-events-none absolute inset-y-0 left-3 flex items-center'>
                                <Search size={14} className='text-muted-foreground' />
                            </div>
                            <input
                                id='dataset-search'
                                type='search'
                                placeholder='Search datasets…'
                                value={query}
                                onChange={(e) =>
                                    handleQueryChange(e.target.value)
                                }
                                className='h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20'
                            />
                        </div>
                        {!isLoading && data !== undefined && (
                            <p className='shrink-0 whitespace-nowrap text-xs text-muted-foreground'>
                                <span className='font-semibold text-primary'>
                                    {total}
                                </span>{' '}
                                dataset
                                {total !== 1 ? 's' : ''}
                                {debouncedQuery && (
                                    <>
                                        {' '}
                                        matching &ldquo;{debouncedQuery}
                                        &rdquo;
                                    </>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Mobile — filters live in a drawer */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                className='gap-2 lg:hidden'>
                                <SlidersHorizontal size={13} />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className='flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground'>
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className='lg:hidden'>
                            <DrawerTitle className='sr-only'>
                                Filter datasets
                            </DrawerTitle>
                            <div className='max-h-[65vh] overflow-y-auto px-4 pt-4 pb-2'>
                                <DatasetFiltersPanel {...filtersProps} bare />
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

                <div className='flex items-start gap-6'>
                    {/* Dataset list — left-aligned */}
                    <div className='min-w-0 flex-1 space-y-4'>
                        {/* Dataset cards — mobile only */}
                        <div className='lg:hidden'>
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
                                        {emptyTitle}
                                    </p>
                                    <p className='mt-1 text-sm text-muted-foreground'>
                                        {emptyHint}
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
                        <div className='hidden lg:block'>
                            {isLoading ? (
                                <div className='space-y-3'>
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))}
                                </div>
                            ) : !documents?.length ? (
                                <div className='flex flex-col items-center justify-center rounded-xl border border-border bg-card py-24 text-center'>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                                        <Search size={20} className='text-primary' />
                                    </div>
                                    <p className='font-medium text-foreground'>
                                        {emptyTitle}
                                    </p>
                                    <p className='mt-1 text-sm text-muted-foreground'>
                                        {emptyHint}
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-3'>
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

                        <DatasetPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    {/* Filters */}
                    <aside className='hidden w-80 shrink-0 lg:block'>
                        <DatasetFiltersPanel {...filtersProps} />
                    </aside>
                </div>
            </div>

            <DatasetPreviewModal
                doc={selectedDoc}
                onCloseAction={() => setSelectedId(null)}
            />
        </>
    )
}
