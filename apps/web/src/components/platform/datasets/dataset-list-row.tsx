'use client'

import Link from 'next/link'
import { FileSpreadsheet, FileText, ChevronRight, GitBranch } from 'lucide-react'
import type { DocumentMetadata } from '@repo/db/schema'
import { type Document } from '../dataset/dataset-card'
import {
    extractDescription,
    formatBytes,
    parseInsightsSummary,
    timeAgo,
} from '@/lib/platform/format'
import { DATASET_CATEGORIES } from '@/lib/constants/dataset-taxonomy'

const CATEGORY_LABELS: Map<string, string> = new Map(
    DATASET_CATEGORIES.map((c) => [c.value, c.label]),
)

type DatasetListRowProps = {
    doc: Document
    selected: boolean
    onPreviewAction: (id: string) => void
}

export function DatasetListRow({
    doc,
    selected,
    onPreviewAction,
}: DatasetListRowProps) {
    const meta = doc.metadata as DocumentMetadata | null
    const isExcel =
        doc.mimeType.includes('excel') || doc.mimeType.includes('spreadsheet')
    const revisionCount = doc.revisionCount ?? 0
    const description =
        extractDescription(doc.description) ||
        parseInsightsSummary(doc.aiInsights).summary

    return (
        <div
            className={`rounded-xl border bg-card px-4 py-3.5 shadow-sm transition-shadow ${
                selected
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border hover:shadow-md'
            }`}>
            <div className='flex items-center gap-4'>
                {/* file icon */}
                <div
                    className={`shrink-0 rounded-lg p-2 ${
                        isExcel
                            ? 'bg-success/10 text-success'
                            : 'bg-primary/10 text-primary'
                    }`}>
                    {isExcel ? (
                        <FileSpreadsheet size={15} />
                    ) : (
                        <FileText size={15} />
                    )}
                </div>

                {/* name + meta */}
                <div className='min-w-0 flex-1'>
                    <Link
                        href={`/datasets/${doc.slug ?? doc.id}`}
                        className='block truncate text-sm font-medium text-foreground hover:underline underline-offset-2'>
                        {doc.name}
                    </Link>
                    <p className='mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground'>
                        {formatBytes(doc.size)}
                        {' · '}
                        {revisionCount > 0
                            ? `updated ${timeAgo(doc.latestRevisionAt ?? doc.createdAt)}`
                            : timeAgo(doc.createdAt)}
                        {revisionCount > 0 && (
                            <span className='inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px]'>
                                <GitBranch size={10} />
                                v{revisionCount + 1}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* description */}
            {description && (
                <p className='mt-2 line-clamp-3 text-xs text-muted-foreground'>
                    {description}
                </p>
            )}

            {/* category + tags */}
            {(doc.category || doc.tags?.length) && (
                <div className='mt-2 flex flex-wrap items-center gap-1.5'>
                    {doc.category && (
                        <span className='rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                            {CATEGORY_LABELS.get(doc.category) ?? doc.category}
                        </span>
                    )}
                    {doc.tags?.slice(0, 4).map((tag) => (
                        <span
                            key={tag}
                            className='rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground'>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* stats + preview */}
            <div className='mt-3 flex items-center gap-4'>
                {meta && (
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                        <span>
                            <span className='font-semibold text-primary'>
                                {meta.rowCount.toLocaleString()}
                            </span>{' '}
                            rows
                        </span>
                        <span>
                            <span className='font-semibold text-primary'>
                                {meta.columnCount}
                            </span>{' '}
                            cols
                        </span>
                    </div>
                )}

                <button
                    type='button'
                    onClick={() => onPreviewAction(doc.id)}
                    className={`ml-auto shrink-0 flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        selected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}>
                    Preview
                    <ChevronRight
                        size={12}
                        className={`transition-transform duration-200 ${selected ? 'rotate-90' : ''}`}
                    />
                </button>
            </div>
        </div>
    )
}
