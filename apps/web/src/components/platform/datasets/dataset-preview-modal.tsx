'use client'

import { redirect, RedirectType } from 'next/navigation'
import {
    FileSpreadsheet,
    FileText,
    ArrowRight,
    Rows3,
    Columns3,
    HardDrive,
    Sheet,
    GitBranch,
} from 'lucide-react'
import type { DocumentMetadata } from '@repo/db/schema'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@repo/ui/components/dialog'
import { MetadataPanel, type Document } from '../dataset/dataset-card'
import { formatBytes, timeAgo } from '@/lib/platform/format'

type DatasetPreviewModalProps = {
    doc: Document | null
    onCloseAction: () => void
}

type StatCardProps = {
    icon: React.ReactNode
    value: string
    label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
    return (
        <div className='flex flex-col gap-2 rounded-xl border border-border bg-card px-5 py-4'>
            <div className='flex items-center gap-2 text-muted-foreground'>
                {icon}
                <span className='text-xs font-medium uppercase tracking-wider'>
                    {label}
                </span>
            </div>
            <p className='font-mono text-2xl font-bold text-foreground leading-none'>
                {value}
            </p>
        </div>
    )
}

export function DatasetPreviewModal({
    doc,
    onCloseAction,
}: DatasetPreviewModalProps) {
    const revisionCount = doc?.revisionCount ?? 0

    const meta = doc?.metadata as DocumentMetadata | null
    const isExcel =
        doc?.mimeType.includes('excel') || doc?.mimeType.includes('spreadsheet')
    const fileType = isExcel ? 'Excel' : 'CSV'

    return (
        <Dialog
            open={!!doc}
            onOpenChange={(open: boolean) => !open && onCloseAction()}>
            <DialogContent
                showCloseButton
                className='w-[calc(100vw-2rem)] max-w-5xl sm:max-w-[900px] md:max-w-[1100px] p-0 gap-0 overflow-hidden flex flex-col max-h-[88vh]'>
                {/* branded top stripe */}
                <div className='h-1 shrink-0 bg-linear-to-r from-primary via-accent/60 to-primary/20' />

                {/* header */}
                <div className='shrink-0 px-8 pt-7 pb-6'>
                    <div className='flex items-start gap-4 pr-8'>
                        <div
                            className={`shrink-0 rounded-xl p-3 ${isExcel ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                            {isExcel ? (
                                <FileSpreadsheet size={22} />
                            ) : (
                                <FileText size={22} />
                            )}
                        </div>
                        <div className='min-w-0 flex-1'>
                            <DialogTitle className='font-sans font-light text-xl text-foreground leading-snug truncate'>
                                {doc?.name ?? ''}
                            </DialogTitle>
                            <DialogDescription className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                                Uploaded {doc ? timeAgo(doc.createdAt) : ''}
                                {revisionCount > 0 && (
                                    <span className='inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground'>
                                        <GitBranch size={11} />v
                                        {revisionCount + 1}
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                {/* stat cards */}
                <div className='shrink-0 grid grid-cols-2 gap-3 px-8 pb-6 sm:grid-cols-4'>
                    <StatCard
                        icon={<Rows3 size={14} />}
                        value={meta ? meta.rowCount.toLocaleString() : '—'}
                        label='Rows'
                    />
                    <StatCard
                        icon={<Columns3 size={14} />}
                        value={meta ? String(meta.columnCount) : '—'}
                        label='Columns'
                    />
                    <StatCard
                        icon={<HardDrive size={14} />}
                        value={doc ? formatBytes(doc.size) : '—'}
                        label='Size'
                    />
                    <StatCard
                        icon={<Sheet size={14} />}
                        value={meta?.analyzedSheet ?? fileType}
                        label={meta?.analyzedSheet ? 'Sheet' : 'Format'}
                    />
                </div>

                {/* schema section heading */}
                <div className='shrink-0 mx-8 mb-4 flex items-center gap-3'>
                    <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                        Column schema
                    </span>
                    <div className='h-px flex-1 bg-border' />
                    {meta && (
                        <span className='font-mono text-[11px] text-muted-foreground'>
                            {meta.columnCount} columns
                        </span>
                    )}
                </div>

                {/* scrollable schema table */}
                <div className='flex-1 overflow-y-auto px-8 pb-4'>
                    {meta ? (
                        <MetadataPanel meta={meta} />
                    ) : (
                        <p className='py-8 text-center text-sm text-muted-foreground'>
                            No metadata available for this dataset.
                        </p>
                    )}
                </div>

                {/* footer CTA */}
                <div className='shrink-0 flex items-center justify-between gap-4 border-t border-border bg-muted/30 px-8 py-4'>
                    <p className='text-xs text-muted-foreground'>
                        View the full dataset page for charts, insights, and
                        download.
                    </p>
                    {doc && (
                        <button
                            onClick={() => {
                                redirect(
                                    `/datasets/${doc.slug ?? doc.id}`,
                                    RedirectType.push,
                                )
                            }}
                            className='inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                            View dataset
                            <ArrowRight size={15} />
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
