'use client'

import { X } from 'lucide-react'
import type { DocumentMetadata } from '@repo/db/schema'
import { MetadataPanel, type Document } from './dataset-card'
import { formatBytes, timeAgo } from '@/lib/platform/format'

type DatasetPanelProps = {
    doc: Document
    onClose: () => void
}

export function DatasetPanel({ doc, onClose }: DatasetPanelProps) {
    const meta = doc.metadata as DocumentMetadata | null

    return (
        <div className='flex h-full flex-col overflow-hidden'>
            {/* header */}
            <div className='flex items-start justify-between gap-3 border-b border-border px-5 py-4'>
                <div className='min-w-0'>
                    <p className='truncate font-medium text-foreground'>{doc.name}</p>
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                        {formatBytes(doc.size)} · {timeAgo(doc.createdAt)}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className='shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground'
                    aria-label='Close panel'
                >
                    <X size={16} />
                </button>
            </div>

            {/* summary stats */}
            {meta && (
                <div className='flex gap-6 border-b border-border bg-primary/5 px-5 py-3 text-sm'>
                    <span>
                        <span className='font-semibold text-primary'>{meta.rowCount.toLocaleString()}</span>{' '}
                        <span className='text-muted-foreground'>rows</span>
                    </span>
                    <span>
                        <span className='font-semibold text-primary'>{meta.columnCount}</span>{' '}
                        <span className='text-muted-foreground'>columns</span>
                    </span>
                    {meta.analyzedSheet && (
                        <span className='text-muted-foreground'>
                            sheet: <span className='font-medium text-foreground'>{meta.analyzedSheet}</span>
                        </span>
                    )}
                </div>
            )}

            {/* column details */}
            <div className='flex-1 overflow-y-auto px-5 py-4'>
                {meta ? (
                    <MetadataPanel meta={meta} />
                ) : (
                    <p className='text-sm text-muted-foreground'>No metadata available.</p>
                )}
            </div>
        </div>
    )
}
