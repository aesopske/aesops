'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Download } from 'lucide-react'
import { formatBytes, timeAgo } from '@/lib/platform/format'
import type { MetadataDiff } from '@/lib/schemas/dataset'

type Revision = {
    id: string
    name: string
    size: number
    createdAt: Date
    metadataDiff: unknown
}

type Props = { documentId: string; revisions: Revision[] }

export function DatasetVersionHistory({ revisions }: Props) {
    const [open, setOpen] = useState(false)

    if (!revisions.length) return null

    return (
        <section>
            <button
                onClick={() => setOpen((o) => !o)}
                className='flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground'
            >
                {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                {revisions.length} {revisions.length === 1 ? 'version' : 'versions'}
            </button>

            {open && (
                <ul className='mt-3 space-y-2'>
                    {revisions.map((rev) => {
                        const diff = rev.metadataDiff as MetadataDiff | null
                        return (
                            <li key={rev.id}>
                                <a
                                    href={`/api/download/${rev.id}`}
                                    className='flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50'
                                >
                                    <Download size={14} className='mt-0.5 shrink-0 text-muted-foreground' />
                                    <div className='min-w-0 flex-1'>
                                        <p className='truncate text-sm font-medium text-foreground'>
                                            {rev.name}
                                        </p>
                                        <p className='mt-0.5 text-xs text-muted-foreground'>
                                            {formatBytes(rev.size)} · {timeAgo(rev.createdAt)}
                                        </p>
                                        {diff && (
                                            <div className='mt-1.5 flex flex-wrap gap-1.5'>
                                                {diff.rowCountDelta !== 0 && (
                                                    <span
                                                        className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] ${
                                                            diff.rowCountDelta > 0
                                                                ? 'bg-success/10 text-success'
                                                                : 'bg-destructive/10 text-destructive'
                                                        }`}
                                                    >
                                                        {diff.rowCountDelta > 0 ? '+' : ''}
                                                        {diff.rowCountDelta.toLocaleString()} rows
                                                    </span>
                                                )}
                                                {diff.columnCountDelta !== 0 && (
                                                    <span
                                                        className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] ${
                                                            diff.columnCountDelta > 0
                                                                ? 'bg-success/10 text-success'
                                                                : 'bg-destructive/10 text-destructive'
                                                        }`}
                                                    >
                                                        {diff.columnCountDelta > 0 ? '+' : ''}
                                                        {diff.columnCountDelta} cols
                                                    </span>
                                                )}
                                                {diff.addedColumns.length > 0 && (
                                                    <span className='inline-flex items-center rounded bg-success/10 px-1.5 py-0.5 font-mono text-[10px] text-success'>
                                                        +{diff.addedColumns.length} new col
                                                        {diff.addedColumns.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                                {diff.removedColumns.length > 0 && (
                                                    <span className='inline-flex items-center rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] text-destructive'>
                                                        -{diff.removedColumns.length} col
                                                        {diff.removedColumns.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
    )
}
