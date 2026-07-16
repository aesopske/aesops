'use client'

import { cn } from '@repo/ui/lib/utils'
import { LICENSES } from '@/lib/constants/licenses'

type Props = {
    licenseOptions: string[]
    selectedLicenses: string[]
    onToggleLicense: (value: string) => void
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

function NumberField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder: string
}) {
    return (
        <label className='space-y-1'>
            <span className='block text-[11px] text-muted-foreground'>
                {label}
            </span>
            <input
                type='number'
                min={0}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className='h-9 w-full rounded-md border border-border bg-card px-2.5 text-xs outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20'
            />
        </label>
    )
}

export function DatasetFiltersPanel({
    licenseOptions,
    selectedLicenses,
    onToggleLicense,
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

            {licenseOptions.length > 0 && (
                <div className='space-y-2'>
                    <p className='text-xs font-medium text-foreground'>
                        License
                    </p>
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
                </div>
            )}

            <div className='space-y-2'>
                <p className='text-xs font-medium text-foreground'>
                    Dataset size (MB)
                </p>
                <div className='flex items-center gap-2'>
                    <NumberField
                        label='Min'
                        value={minSize}
                        onChange={onMinSizeChange}
                        placeholder='0'
                    />
                    <NumberField
                        label='Max'
                        value={maxSize}
                        onChange={onMaxSizeChange}
                        placeholder='Any'
                    />
                </div>
            </div>

            <div className='space-y-2'>
                <p className='text-xs font-medium text-foreground'>
                    Row count
                </p>
                <div className='flex items-center gap-2'>
                    <NumberField
                        label='Min'
                        value={minRows}
                        onChange={onMinRowsChange}
                        placeholder='0'
                    />
                    <NumberField
                        label='Max'
                        value={maxRows}
                        onChange={onMaxRowsChange}
                        placeholder='Any'
                    />
                </div>
            </div>
        </div>
    )
}
