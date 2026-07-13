'use client'

import Link from 'next/link'
import { FileSpreadsheet, FileText, PanelRightOpen } from 'lucide-react'
import type { ColumnStats, DocumentMetadata } from '@repo/db/schema'
import { formatBytes, timeAgo } from '@/lib/platform/format'

export { formatBytes, timeAgo }

// Maps data types to design system semantic tokens
const DTYPE_COLOURS: Record<string, string> = {
    float32: 'text-primary bg-primary/10',
    float64: 'text-primary bg-primary/10',
    int32: 'text-info bg-info/10',
    int64: 'text-info bg-info/10',
    string: 'text-muted-foreground bg-muted',
    boolean: 'text-success bg-success/10',
    datetime: 'text-accent-foreground bg-accent/20',
}

export function DTypeBadge({ dtype }: { dtype: string }) {
    const cls = DTYPE_COLOURS[dtype] ?? 'text-warning-foreground bg-warning/40'
    return (
        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${cls}`}>
            {dtype}
        </span>
    )
}

// ─── metadata panel (used in side panel) ──────────────────────────────────────

export function MetadataPanel({ meta }: { meta: DocumentMetadata }) {
    return (
        <div>
            <div className='mb-3 flex flex-wrap gap-4 text-sm text-muted-foreground'>
                {meta.analyzedSheet && (
                    <span>
                        Sheet:{' '}
                        <span className='font-medium text-foreground'>
                            {meta.analyzedSheet}
                        </span>
                    </span>
                )}
                {meta.sheetNames && meta.sheetNames.length > 1 && (
                    <span className='rounded-full bg-secondary px-2 py-0.5 text-xs'>
                        {meta.sheetNames.length} sheets
                    </span>
                )}
            </div>
            <table className='w-full text-xs'>
                <thead>
                    <tr className='border-b border-border text-left text-muted-foreground'>
                        <th className='pb-1 pr-3 font-medium'>Column</th>
                        <th className='pb-1 pr-3 font-medium'>Type</th>
                        <th className='pb-1 pr-3 font-medium'>Nulls</th>
                        <th className='pb-1 pr-3 font-medium'>Unique</th>
                        <th className='pb-1 font-medium'>Stats / Top values</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-border'>
                    {meta.columns.map((col) => (
                        <ColumnRow key={col.name} col={col} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ColumnRow({ col }: { col: ColumnStats }) {
    const isNumeric = col.mean !== undefined
    return (
        <tr className='align-top'>
            <td className='py-1.5 pr-3 font-medium text-foreground'>
                {col.name}
            </td>
            <td className='py-1.5 pr-3'>
                <DTypeBadge dtype={col.dtype} />
            </td>
            <td className='py-1.5 pr-3 text-muted-foreground'>
                {col.nullPercent > 0 ? (
                    <span className='text-warning-foreground'>
                        {col.nullPercent}%
                    </span>
                ) : (
                    '—'
                )}
            </td>
            <td className='py-1.5 pr-3 text-muted-foreground'>
                {col.uniqueCount.toLocaleString()}
            </td>
            <td className='py-1.5 text-muted-foreground'>
                {isNumeric ? (
                    <span>
                        mean <span className='text-foreground'>{col.mean}</span>
                        {' · '}min{' '}
                        <span className='text-foreground'>{col.min}</span>
                        {' · '}max{' '}
                        <span className='text-foreground'>{col.max}</span>
                        {col.median !== undefined && (
                            <>
                                {' '}
                                · median{' '}
                                <span className='text-foreground'>
                                    {col.median}
                                </span>
                            </>
                        )}
                    </span>
                ) : col.topValues?.length ? (
                    col.topValues.map(({ value, count }) => (
                        <span key={value} className='mr-1.5'>
                            {value}{' '}
                            <span className='text-muted-foreground'>
                                ({count})
                            </span>
                        </span>
                    ))
                ) : (
                    col.sampleValues?.join(', ')
                )}
            </td>
        </tr>
    )
}

// ─── card ─────────────────────────────────────────────────────────────────────

export type Document = {
    id: string
    slug?: string | null
    name: string
    mimeType: string
    size: number
    createdAt: Date
    metadata: unknown
    revisionCount?: number
    latestRevisionAt?: Date | null
}

const COLUMN_PREVIEW_LIMIT = 6

type DatasetCardProps = {
    doc: Document
    selected: boolean
    onPreview: (id: string) => void
}

export function DatasetCard({ doc, selected, onPreview }: DatasetCardProps) {
    const meta = doc.metadata as DocumentMetadata | null
    const isExcel =
        doc.mimeType.includes('excel') || doc.mimeType.includes('spreadsheet')
    const previewCols = meta?.columns.slice(0, COLUMN_PREVIEW_LIMIT) ?? []
    const hiddenCount = (meta?.columns.length ?? 0) - COLUMN_PREVIEW_LIMIT

    return (
        <Link
            href={`/datasets/${doc.slug ?? doc.id}`}
            className={`group block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border'
            }`}>
            <div className='p-4'>
                {/* header row */}
                <div className='flex min-w-0 items-start gap-3'>
                    <div
                        className={`shrink-0 rounded-lg p-2 ${isExcel ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        {isExcel ? (
                            <FileSpreadsheet size={18} />
                        ) : (
                            <FileText size={18} />
                        )}
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='wrap-break-word font-medium text-foreground'>
                            {doc.name}
                        </p>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                            {formatBytes(doc.size)} · {timeAgo(doc.createdAt)}
                        </p>
                    </div>
                </div>

                {/* stats */}
                {meta && (
                    <div className='mt-3 flex items-baseline gap-1.5 text-sm'>
                        <span className='font-semibold text-primary'>
                            {meta.rowCount.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground'>rows</span>
                        <span className='mx-1 text-border'>·</span>
                        <span className='font-semibold text-primary'>
                            {meta.columnCount}
                        </span>
                        <span className='text-muted-foreground'>columns</span>
                    </div>
                )}

                {/* column pills */}
                {previewCols.length > 0 && (
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                        {previewCols.map((col) => (
                            <span
                                key={col.name}
                                className='rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground'>
                                {col.name}
                            </span>
                        ))}
                        {hiddenCount > 0 && (
                            <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary'>
                                +{hiddenCount} more
                            </span>
                        )}
                    </div>
                )}

                {/* preview link */}
                <div className='mt-3 flex justify-end'>
                    <button
                        type='button'
                        onClick={(e) => {
                            e.preventDefault()
                            onPreview(doc.id)
                        }}
                        className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                            selected
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}>
                        <PanelRightOpen size={12} />
                        {selected ? 'Hide preview' : 'Preview details'}
                    </button>
                </div>
            </div>
        </Link>
    )
}
