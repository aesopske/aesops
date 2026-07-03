'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { DiffRowsPreview } from './diff-rows-table'

type RowDiffResult = {
    commonColumns: string[]
    addedCount: number
    removedCount: number
    addedRows: Record<string, unknown>[]
    removedRows: Record<string, unknown>[]
    schemaChanged: boolean
}

type Props = { documentId: string; baselineId: string }

// Lazily fetches the row-level diff of a revision against its baseline. Mounted
// only when the user expands "View row changes", so the query never runs upfront.
// Shows a compact text summary + small preview tables (5 rows each max).
export function VersionRowDiff({ documentId, baselineId }: Props) {
    const [diff, setDiff] = useState<RowDiffResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        fetch(`/api/datasets/${documentId}/diff?from=${baselineId}`)
            .then(async (res) => {
                if (!res.ok) {
                    const body = (await res.json().catch(() => null)) as {
                        error?: string
                    } | null
                    throw new Error(body?.error ?? `Diff failed (${res.status})`)
                }
                return res.json() as Promise<RowDiffResult>
            })
            .then((data) => {
                if (active) setDiff(data)
            })
            .catch((err) => {
                if (active)
                    setError(err instanceof Error ? err.message : 'Diff failed')
            })
            .finally(() => {
                if (active) setLoading(false)
            })
        return () => {
            active = false
        }
    }, [documentId, baselineId])

    if (loading) {
        return (
            <div className='flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground'>
                <Loader2 size={13} className='animate-spin' />
                Computing row changes…
            </div>
        )
    }

    if (error) {
        return <p className='px-4 py-3 text-xs text-destructive'>{error}</p>
    }

    if (!diff) return null

    if (diff.addedCount === 0 && diff.removedCount === 0) {
        return (
            <p className='px-4 py-3 text-xs text-muted-foreground'>
                No row changes
                {diff.schemaChanged
                    ? ' (columns changed — compared over shared columns only)'
                    : ''}
                .
            </p>
        )
    }

    return (
        <div className='space-y-2.5 px-4 py-3'>
            {diff.schemaChanged && (
                <p className='font-mono text-[10px] text-muted-foreground'>
                    ⚠ Columns changed — rows compared over shared columns only.
                </p>
            )}

            <div className='space-y-1'>
                {diff.removedCount > 0 && (
                    <p className='text-sm text-destructive'>
                        <span className='font-semibold'>{diff.removedCount.toLocaleString()} rows removed</span>
                        {diff.addedCount > 0 ? ' · ' : ''}
                    </p>
                )}
                {diff.addedCount > 0 && (
                    <p className='text-sm text-success'>
                        <span className='font-semibold'>{diff.addedCount.toLocaleString()} rows added</span>
                    </p>
                )}
            </div>

            <div className='space-y-2'>
                {diff.removedRows.length > 0 && (
                    <DiffRowsPreview
                        tone='removed'
                        columns={diff.commonColumns}
                        rows={diff.removedRows}
                        total={diff.removedCount}
                    />
                )}
                {diff.addedRows.length > 0 && (
                    <DiffRowsPreview
                        tone='added'
                        columns={diff.commonColumns}
                        rows={diff.addedRows}
                        total={diff.addedCount}
                    />
                )}
            </div>
        </div>
    )
}
