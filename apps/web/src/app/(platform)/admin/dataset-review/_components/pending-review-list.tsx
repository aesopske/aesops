'use client'

import { useState } from 'react'
import { AlertTriangle, Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { trpc } from '@/trpc/react'
import { timeAgo } from '@/lib/platform/format'
import type { AnomalyDetails } from '@repo/db/schema'

type PendingRevision = {
    id: string
    name: string
    slug: string | null
    createdAt: Date
    anomalyDetails: AnomalyDetails | null
}

function PendingReviewSkeletonRow() {
    return (
        <li className='flex animate-pulse items-center gap-3 px-4 py-3.5'>
            <div className='h-9 w-9 shrink-0 rounded-lg bg-muted' />
            <div className='min-w-0 flex-1 space-y-1.5'>
                <div className='h-3.5 w-40 rounded bg-muted' />
                <div className='h-3 w-56 rounded bg-muted' />
            </div>
            <div className='h-7 w-16 shrink-0 rounded-lg bg-muted' />
        </li>
    )
}

function DiffRowsTable({ columns, rows }: { columns: string[]; rows: Record<string, unknown>[] }) {
    return (
        <div className='max-h-80 overflow-auto rounded-lg border border-destructive/30 bg-destructive/5'>
            <table className='w-full text-left text-xs'>
                <thead>
                    <tr className='sticky top-0 border-b border-destructive/30'>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className='whitespace-nowrap bg-destructive/10 px-2.5 py-1.5 font-medium text-destructive backdrop-blur-sm'>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='divide-y divide-destructive/20'>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                                <td key={col} className='whitespace-nowrap px-2.5 py-1.5 text-foreground'>
                                    {String(row[col] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function DiffPanel({ revisionId }: { revisionId: string }) {
    const { data: diff, isLoading, error } = trpc.admin.datasets.diffAgainstPrevious.useQuery({
        id: revisionId,
    })

    if (isLoading) {
        return <p className='mt-3 text-xs text-muted-foreground'>Loading diff…</p>
    }
    if (error || !diff) {
        return (
            <p className='mt-3 text-xs text-destructive'>
                {error?.message ?? 'Unable to load diff'}
            </p>
        )
    }
    if (diff.removedCount === 0) {
        return <p className='mt-3 text-xs text-muted-foreground'>No removed rows to show.</p>
    }

    return (
        <div className='mt-3 space-y-2'>
            <p className='text-xs font-medium text-foreground'>
                {diff.removedCount} row{diff.removedCount === 1 ? '' : 's'} missing from the previous
                version{diff.removedCount > diff.removedRows.length && ` (showing a sample)`}
            </p>
            <DiffRowsTable columns={diff.commonColumns} rows={diff.removedRows} />
        </div>
    )
}

function PendingReviewRowItem({ revision }: { revision: PendingRevision }) {
    const utils = trpc.useUtils()
    const [confirming, setConfirming] = useState(false)
    const [showDiff, setShowDiff] = useState(false)
    const rejectMutation = trpc.admin.datasets.rejectRevision.useMutation()

    const anomaly = revision.anomalyDetails
    const canShowDiff = anomaly?.reason === 'row_drop'

    return (
        <li className='px-4 py-3.5'>
            <div className='flex items-center gap-3'>
                <div className='shrink-0 rounded-lg bg-destructive/10 p-2 text-destructive'>
                    <AlertTriangle size={16} />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium text-foreground'>{revision.name}</p>
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                        {anomaly?.reason === 'row_drop' ? (
                            <>
                                {anomaly.removedCount} of {anomaly.previousRowCount} rows missing (
                                {Math.round(anomaly.removedPercent * 100)}%, threshold{' '}
                                {Math.round(anomaly.thresholdPercent * 100)}%)
                                {anomaly.schemaChanged && (
                                    <span className='ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-destructive'>
                                        schema changed
                                    </span>
                                )}
                            </>
                        ) : anomaly?.reason === 'check_failed' ? (
                            <>Anomaly check couldn&apos;t be completed ({anomaly.error})</>
                        ) : (
                            'Flagged for review'
                        )}
                        {' · '}
                        {timeAgo(revision.createdAt)}
                    </p>
                </div>

                <div className='flex shrink-0 items-center gap-1'>
                    {canShowDiff && (
                        <button
                            onClick={() => setShowDiff((v) => !v)}
                            className='flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary'>
                            View diff
                            {showDiff ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                    )}
                    {confirming ? (
                        <>
                            <span className='mr-1 text-xs text-destructive'>Reject?</span>
                            <button
                                onClick={() =>
                                    rejectMutation.mutate(
                                        { id: revision.id },
                                        { onSuccess: () => utils.admin.datasets.listPendingReview.invalidate() },
                                    )
                                }
                                disabled={rejectMutation.isPending}
                                className='rounded p-1.5 text-destructive transition hover:bg-destructive/10 disabled:opacity-50'
                                aria-label='Confirm reject'>
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setConfirming(false)}
                                disabled={rejectMutation.isPending}
                                className='rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50'
                                aria-label='Cancel reject'>
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            className='rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-destructive/30 hover:text-destructive'>
                            Reject
                        </button>
                    )}
                </div>
            </div>

            {showDiff && canShowDiff && <DiffPanel revisionId={revision.id} />}
        </li>
    )
}

export function PendingReviewList() {
    const { data: revisions, isLoading } = trpc.admin.datasets.listPendingReview.useQuery()

    return (
        <div>
            {isLoading ? (
                <ul className='divide-y divide-border rounded-xl border border-border bg-card'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PendingReviewSkeletonRow key={i} />
                    ))}
                </ul>
            ) : !revisions?.length ? (
                <div className='py-12 text-center'>
                    <p className='text-sm font-medium text-muted-foreground'>Nothing needs review</p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                        Uploads with an unusually large row drop will show up here.
                    </p>
                </div>
            ) : (
                <ul className='divide-y divide-border rounded-xl border border-border bg-card'>
                    {(revisions as PendingRevision[]).map((revision) => (
                        <PendingReviewRowItem key={revision.id} revision={revision} />
                    ))}
                </ul>
            )}
        </div>
    )
}
