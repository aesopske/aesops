'use client'

import { cn } from '@repo/ui/lib/utils'
import { LICENSES } from '@/lib/constants/licenses'
import { DATASET_CATEGORIES } from '@/lib/constants/dataset-taxonomy'

type RangePreset = { label: string; min: string; max: string }

const SIZE_PRESETS: RangePreset[] = [
    { label: 'Any size', min: '', max: '' },
    { label: 'Under 1 MB', min: '', max: '1' },
    { label: '1 – 10 MB', min: '1', max: '10' },
    { label: '10 – 100 MB', min: '10', max: '100' },
    { label: 'Over 100 MB', min: '100', max: '' },
]

const ROW_PRESETS: RangePreset[] = [
    { label: 'Any row count', min: '', max: '' },
    { label: 'Under 1,000 rows', min: '', max: '1000' },
    { label: '1,000 – 10,000 rows', min: '1000', max: '10000' },
    { label: '10,000 – 100,000 rows', min: '10000', max: '100000' },
    { label: 'Over 100,000 rows', min: '100000', max: '' },
]

type Props = {
    licenseOptions: string[]
    licenseOptionsLoading: boolean
    selectedLicenses: string[]
    onToggleLicense: (value: string) => void
    categoryOptions: string[]
    categoryOptionsLoading: boolean
    selectedCategories: string[]
    onToggleCategory: (value: string) => void
    tagOptions: string[]
    tagOptionsLoading: boolean
    selectedTags: string[]
    onToggleTag: (value: string) => void
    minSize: string
    maxSize: string
    onMinSizeChange: (value: string) => void
    onMaxSizeChange: (value: string) => void
    minRows: string
    maxRows: string
    onMinRowsChange: (value: string) => void
    onMaxRowsChange: (value: string) => void
    onClear: () => void
    hasActiveFilters: boolean
    /** Strip the card chrome — used inside the mobile filters drawer, which already provides one. */
    bare?: boolean
}

const LICENSE_LABELS = new Map(LICENSES.map((l) => [l.value, l.label]))
const CATEGORY_LABELS: Map<string, string> = new Map(
    DATASET_CATEGORIES.map((c) => [c.value, c.label]),
)

function CheckboxListSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className='space-y-2.5'>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className='flex animate-pulse items-center gap-2'>
                    <div className='h-3.5 w-3.5 rounded bg-muted' />
                    <div
                        className='h-3 rounded bg-muted'
                        style={{ width: `${60 + ((i * 17) % 40)}%` }}
                    />
                </div>
            ))}
        </div>
    )
}

function PillListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className='flex flex-wrap gap-1.5'>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className='h-6 animate-pulse rounded-full bg-muted'
                    style={{ width: `${48 + ((i * 13) % 36)}px` }}
                />
            ))}
        </div>
    )
}

export function DatasetFiltersPanel({
    licenseOptions,
    licenseOptionsLoading,
    selectedLicenses,
    onToggleLicense,
    categoryOptions,
    categoryOptionsLoading,
    selectedCategories,
    onToggleCategory,
    tagOptions,
    tagOptionsLoading,
    selectedTags,
    onToggleTag,
    minSize,
    maxSize,
    onMinSizeChange,
    onMaxSizeChange,
    minRows,
    maxRows,
    onMinRowsChange,
    onMaxRowsChange,
    onClear,
    hasActiveFilters,
    bare = false,
}: Props) {
    return (
        <div
            className={cn(
                'space-y-6',
                !bare && 'rounded-xl border border-border bg-card p-4',
            )}>
            <div className='flex items-center justify-between'>
                <h3 className='text-[11px] font-medium uppercase tracking-wider text-muted-foreground'>
                    Filters
                </h3>
                {hasActiveFilters && (
                    <button
                        type='button'
                        onClick={onClear}
                        className='text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground'>
                        Clear
                    </button>
                )}
            </div>

            {(categoryOptionsLoading || categoryOptions.length > 0) && (
                <div className='space-y-2'>
                    <p className='text-xs font-medium text-foreground'>
                        Category
                    </p>
                    {categoryOptionsLoading ? (
                        <CheckboxListSkeleton />
                    ) : (
                        <div className='space-y-1.5'>
                            {categoryOptions.map((value) => (
                                <label
                                    key={value}
                                    className='flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground'>
                                    <input
                                        type='checkbox'
                                        checked={selectedCategories.includes(value)}
                                        onChange={() => onToggleCategory(value)}
                                        className='h-3.5 w-3.5 rounded border-border accent-primary'
                                    />
                                    {CATEGORY_LABELS.get(value) ?? value}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {(tagOptionsLoading || tagOptions.length > 0) && (
                <div className='space-y-2'>
                    <p className='text-xs font-medium text-foreground'>Tags</p>
                    {tagOptionsLoading ? (
                        <PillListSkeleton />
                    ) : (
                        <div className='flex flex-wrap gap-1.5'>
                            {tagOptions.map((value) => {
                                const active = selectedTags.includes(value)
                                return (
                                    <button
                                        key={value}
                                        type='button'
                                        onClick={() => onToggleTag(value)}
                                        className={cn(
                                            'rounded-full border px-2.5 py-1 text-[11px] transition',
                                            active
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border text-muted-foreground hover:text-foreground',
                                        )}>
                                        {value}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {(licenseOptionsLoading || licenseOptions.length > 0) && (
                <div className='space-y-2'>
                    <p className='text-xs font-medium text-foreground'>
                        License
                    </p>
                    {licenseOptionsLoading ? (
                        <CheckboxListSkeleton />
                    ) : (
                        <div className='space-y-1.5'>
                            {licenseOptions.map((value) => (
                                <label
                                    key={value}
                                    className='flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground'>
                                    <input
                                        type='checkbox'
                                        checked={selectedLicenses.includes(value)}
                                        onChange={() => onToggleLicense(value)}
                                        className='h-3.5 w-3.5 rounded border-border accent-primary'
                                    />
                                    {LICENSE_LABELS.get(value) ?? value}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className='space-y-2'>
                <p className='text-xs font-medium text-foreground'>
                    Dataset size
                </p>
                <div className='space-y-1.5'>
                    {SIZE_PRESETS.map((preset) => (
                        <label
                            key={preset.label}
                            className='flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground'>
                            <input
                                type='radio'
                                name='size-preset'
                                checked={
                                    minSize === preset.min && maxSize === preset.max
                                }
                                onChange={() => {
                                    onMinSizeChange(preset.min)
                                    onMaxSizeChange(preset.max)
                                }}
                                className='h-3.5 w-3.5 border-border accent-primary'
                            />
                            {preset.label}
                        </label>
                    ))}
                </div>
            </div>

            <div className='space-y-2'>
                <p className='text-xs font-medium text-foreground'>
                    Row count
                </p>
                <div className='space-y-1.5'>
                    {ROW_PRESETS.map((preset) => (
                        <label
                            key={preset.label}
                            className='flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground'>
                            <input
                                type='radio'
                                name='row-preset'
                                checked={
                                    minRows === preset.min && maxRows === preset.max
                                }
                                onChange={() => {
                                    onMinRowsChange(preset.min)
                                    onMaxRowsChange(preset.max)
                                }}
                                className='h-3.5 w-3.5 border-border accent-primary'
                            />
                            {preset.label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}
