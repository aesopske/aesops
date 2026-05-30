'use client'

import Link from 'next/link'
import { FileSpreadsheet, FileText, ChevronRight, GitBranch } from 'lucide-react'
import type { DocumentMetadata } from '@repo/db/schema'
import { type Document } from '../dataset/dataset-card'
import { formatBytes, timeAgo } from '@/lib/platform/format'

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

    return (
        <div
            className={`group flex items-center gap-4 px-4 py-3.5 transition-colors ${
                selected
                    ? 'bg-primary/5 border-l-2 border-l-primary'
                    : 'border-l-2 border-l-transparent hover:bg-muted/40'
            }`}>
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
                    {doc.revisionCount && doc.revisionCount > 0
                        ? `updated ${timeAgo(doc.latestRevisionAt ?? doc.createdAt)}`
                        : timeAgo(doc.createdAt)}
                    {doc.revisionCount && doc.revisionCount > 0 && (
                        <span className='inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px]'>
                            <GitBranch size={10} />
                            v{doc.revisionCount + 1}
                        </span>
                    )}
                </p>
            </div>

            {/* stats */}
            {meta && (
                <div className='hidden shrink-0 items-center gap-4 text-xs text-muted-foreground sm:flex'>
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

            {/* preview button */}
            <button
                type='button'
                onClick={() => onPreviewAction(doc.id)}
                className={`shrink-0 flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    selected
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>
                Preview
                <ChevronRight
                    size={12}
                    className={`transition-transform duration-200 ${selected ? 'rotate-90' : ''}`}
                />
            </button>
        </div>
    )
}
