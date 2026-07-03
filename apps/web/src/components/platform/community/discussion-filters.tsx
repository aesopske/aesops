'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui/components/select'
import { cn } from '@repo/ui/lib/utils'
import { FilterPill } from './filter-pill'

export type Recency = 'all' | 'today' | '7d' | '30d' | 'year'
export type Source = 'all' | 'dataset' | 'blog' | 'none'
export type Sort = 'newest' | 'oldest' | 'mostReplies'

type DatasetOption = { id: string; name: string }

type Props = {
    recency: Recency
    source: Source
    dataset: string
    sort: Sort
    datasetOptions: DatasetOption[]
    activeCount: number
    onRecencyChange: (v: Recency) => void
    onSourceChange: (v: Source) => void
    onDatasetChange: (v: string) => void
    onSortChange: (v: Sort) => void
    onReset: () => void
    bare?: boolean
}

const RECENCY_OPTIONS: { value: Recency; label: string }[] = [
    { value: 'all', label: 'Any' },
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'year', label: 'This year' },
]

const SOURCE_OPTIONS: { value: Source; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'dataset', label: 'Dataset' },
    { value: 'blog', label: 'Blog' },
    { value: 'none', label: 'No link' },
]

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='space-y-2.5'>
            <p className='text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
                {label}
            </p>
            {children}
        </div>
    )
}

export function DiscussionFilters({
    recency,
    source,
    dataset,
    sort,
    datasetOptions,
    activeCount,
    onRecencyChange,
    onSourceChange,
    onDatasetChange,
    onSortChange,
    onReset,
    bare = false,
}: Props) {
    return (
        <div
            className={cn(
                'space-y-5',
                !bare && 'rounded-xl border border-border bg-card p-4',
            )}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold text-foreground'>Filters</span>
                    {activeCount > 0 && (
                        <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground'>
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        type='button'
                        onClick={onReset}
                        className='text-xs font-medium text-primary hover:underline underline-offset-2'>
                        Reset
                    </button>
                )}
            </div>

            <Section label='Recency'>
                <div className='flex flex-wrap gap-1.5'>
                    {RECENCY_OPTIONS.map((o) => (
                        <FilterPill
                            key={o.value}
                            selected={recency === o.value}
                            onClick={() => onRecencyChange(o.value)}>
                            {o.label}
                        </FilterPill>
                    ))}
                </div>
            </Section>

            <Section label='Source'>
                <div className='flex flex-wrap gap-1.5'>
                    {SOURCE_OPTIONS.map((o) => (
                        <FilterPill
                            key={o.value}
                            selected={source === o.value}
                            onClick={() => onSourceChange(o.value)}>
                            {o.label}
                        </FilterPill>
                    ))}
                </div>
            </Section>

            <Section label='Dataset'>
                <Select
                    value={dataset || 'all'}
                    onValueChange={(v: string) => onDatasetChange(v === 'all' ? '' : v)}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder='All datasets' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All datasets</SelectItem>
                        {datasetOptions.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                                {d.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Section>

            <Section label='Sort'>
                <Select value={sort} onValueChange={(v: string) => onSortChange(v as Sort)}>
                    <SelectTrigger className='w-full'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='newest'>Newest</SelectItem>
                        <SelectItem value='oldest'>Oldest</SelectItem>
                        <SelectItem value='mostReplies'>Most replies</SelectItem>
                    </SelectContent>
                </Select>
            </Section>
        </div>
    )
}
