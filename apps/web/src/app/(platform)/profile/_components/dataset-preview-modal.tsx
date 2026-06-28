'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog'
import type { DocumentMetadata } from '@repo/db/schema'
import { DatasetVisualizations } from '@/components/platform/dataset/dataset-visualizations'
import { DatasetInsights } from '@/components/platform/dataset/dataset-insights'
import { MetadataPanel } from '@/components/platform/dataset/dataset-card'
import { formatBytes, timeAgo } from '@/lib/platform/format'

type Doc = {
    id: string
    name: string
    size: number
    createdAt: Date
    metadata: unknown
    aiInsights: string | null
}

type Props = {
    doc: Doc | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DatasetPreviewModal({ doc, open, onOpenChange }: Props) {
    if (!doc) return null

    const meta = doc.metadata as DocumentMetadata | null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className='max-h-[90vh] w-full max-w-5xl overflow-hidden p-0 sm:max-w-5xl'>
                <DialogHeader className='border-b border-border px-6 py-4'>
                    <DialogTitle className='truncate text-base font-medium'>
                        {doc.name}
                    </DialogTitle>
                    <p className='text-xs text-muted-foreground'>
                        {formatBytes(doc.size)} · uploaded {timeAgo(doc.createdAt)}
                        {meta && (
                            <> · {meta.rowCount.toLocaleString()} rows · {meta.columnCount} cols</>
                        )}
                    </p>
                </DialogHeader>

                <div className='max-h-[calc(90vh-5rem)] overflow-y-auto'>
                    <div className='space-y-5 px-6 py-5'>
                        {meta ? (
                            <>
                                <DatasetVisualizations meta={meta} />
                                <MetadataPanel meta={meta} />
                            </>
                        ) : (
                            <p className='text-sm text-muted-foreground'>
                                No visualization data available for this dataset.
                            </p>
                        )}
                        <DatasetInsights cachedInsights={doc.aiInsights} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
