'use client'

import { useState } from 'react'
import { FileSpreadsheet, FileText, Pencil, Trash2, Check, X, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { trpc } from '@/trpc/react'
import { formatBytes, timeAgo } from '@/lib/platform/format'
import type { DocumentMetadata } from '@repo/db/schema'
import { DatasetPreviewModal } from '@/app/(platform)/profile/_components/dataset-preview-modal'

type Doc = {
    id: string
    slug: string | null
    name: string
    mimeType: string
    size: number
    createdAt: Date
    updatedAt: Date
    description: unknown
    license: string | null
    metadata: unknown
    aiInsights: string | null
    revisionCount: number
    latestRevisionAt: Date | null
}

function extractDescription(raw: unknown): string {
    if (!raw) return ''
    if (typeof raw === 'string') return raw
    const doc = raw as { content?: { content?: { text?: string }[] }[] }
    return (
        doc.content
            ?.flatMap((block) => block.content ?? [])
            .map((node) => node.text ?? '')
            .join('') ?? ''
    )
}

function DatasetRow({ doc }: { doc: Doc }) {
    const utils = trpc.useUtils()
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    const [previewing, setPreviewing] = useState(false)

    const deleteMutation = trpc.documents.delete.useMutation()

    const meta = doc.metadata as DocumentMetadata | null
    const isExcel = doc.mimeType.includes('excel') || doc.mimeType.includes('spreadsheet')
    const description = extractDescription(doc.description)

    return (
        <li className='overflow-hidden'>
            <DatasetPreviewModal doc={doc} open={previewing} onOpenChange={setPreviewing} />
            <div className='flex items-center gap-3 px-4 py-3.5'>
                <div
                    className={`shrink-0 rounded-lg p-2 ${isExcel ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}
                >
                    {isExcel ? <FileSpreadsheet size={16} /> : <FileText size={16} />}
                </div>

                <div className='min-w-0 flex-1'>
                    <Link
                        href={`/datasets/${doc.slug ?? doc.id}`}
                        className='truncate text-sm font-medium text-foreground hover:text-primary'
                    >
                        {doc.name}
                    </Link>
                    <p className='mt-0.5 text-xs text-muted-foreground'>
                        {formatBytes(doc.size)}
                        {meta && (
                            <>
                                {' · '}
                                {meta.rowCount.toLocaleString()} rows · {meta.columnCount} cols
                            </>
                        )}
                        {' · '}
                        {doc.revisionCount > 0
                            ? `updated ${timeAgo(doc.latestRevisionAt ?? doc.updatedAt)}`
                            : `uploaded ${timeAgo(doc.createdAt)}`}
                        {doc.revisionCount > 0 && (
                            <span className='ml-2 rounded-full bg-muted px-2 py-0.5 font-mono text-muted-foreground'>
                                v{doc.revisionCount + 1}
                            </span>
                        )}
                        {doc.license && (
                            <span className='ml-2 rounded-full bg-muted px-2 py-0.5 text-muted-foreground'>
                                {doc.license}
                            </span>
                        )}
                    </p>
                    {description && (
                        <p className='mt-1 line-clamp-2 text-xs text-muted-foreground'>{description}</p>
                    )}
                </div>

                <div className='flex shrink-0 items-center gap-1'>
                    {confirming ? (
                        <>
                            <span className='mr-1 text-xs text-destructive'>Delete?</span>
                            <button
                                onClick={() => deleteMutation.mutate(
                                    { id: doc.id },
                                    { onSuccess: () => utils.documents.listMineRoots.invalidate() },
                                )}
                                disabled={deleteMutation.isPending}
                                className='rounded p-1.5 text-destructive transition hover:bg-destructive/10 disabled:opacity-50'
                                aria-label='Confirm delete'
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setConfirming(false)}
                                disabled={deleteMutation.isPending}
                                className='rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50'
                                aria-label='Cancel delete'
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setPreviewing(true)}
                                className='rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground'
                                aria-label='Preview dataset'
                            >
                                <Eye size={14} />
                            </button>
                            <button
                                onClick={() => router.push(`/datasets/${doc.slug ?? doc.id}/edit`)}
                                className='rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground'
                                aria-label='Edit dataset'
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => setConfirming(true)}
                                className='rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive'
                                aria-label='Delete dataset'
                            >
                                <Trash2 size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </li>
    )
}

export function MyDatasetsList() {
    const { data: documents, isLoading } = trpc.documents.listMineRoots.useQuery(undefined)

    if (isLoading) {
        return <p className='py-8 text-center text-sm text-muted-foreground'>Loading…</p>
    }

    if (!documents?.length) {
        return (
            <div className='py-12 text-center'>
                <p className='text-sm font-medium text-muted-foreground'>No datasets uploaded yet</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                    Your uploads will appear here once you&apos;ve uploaded a dataset.
                </p>
            </div>
        )
    }

    return (
        <ul className='divide-y divide-border rounded-xl border border-border bg-card'>
            {(documents as Doc[]).map((doc) => (
                <DatasetRow key={doc.id} doc={doc} />
            ))}
        </ul>
    )
}
