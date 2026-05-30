'use client'

import { useState } from 'react'
import { trpc } from '@/trpc/react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { ColumnStats, DocumentMetadata } from '@repo/db/schema'

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DTYPE_COLOURS: Record<string, string> = {
    float32: 'text-blue-600 bg-blue-50',
    float64: 'text-blue-600 bg-blue-50',
    int32:   'text-indigo-600 bg-indigo-50',
    int64:   'text-indigo-600 bg-indigo-50',
    string:  'text-gray-600 bg-gray-100',
    boolean: 'text-green-600 bg-green-50',
}

function DTypeBadge({ dtype }: { dtype: string }) {
    const cls = DTYPE_COLOURS[dtype] ?? 'text-orange-600 bg-orange-50'
    return (
        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${cls}`}>
            {dtype}
        </span>
    )
}

function MetadataPanel({ meta }: { meta: DocumentMetadata }) {
    return (
        <div className='border-t border-gray-100 bg-gray-50 px-4 py-4'>
            <div className='mb-3 flex gap-6 text-sm'>
                <span><span className='font-medium'>{meta.rowCount.toLocaleString()}</span> rows</span>
                <span><span className='font-medium'>{meta.columnCount}</span> columns</span>
                {meta.analyzedSheet && (
                    <span className='text-gray-400'>sheet: {meta.analyzedSheet}</span>
                )}
                {meta.sheetNames && meta.sheetNames.length > 1 && (
                    <span className='text-gray-400'>{meta.sheetNames.length} sheets total</span>
                )}
            </div>

            <table className='w-full text-xs'>
                <thead>
                    <tr className='border-b border-gray-200 text-left text-gray-500'>
                        <th className='pb-1 pr-3 font-medium'>Column</th>
                        <th className='pb-1 pr-3 font-medium'>Type</th>
                        <th className='pb-1 pr-3 font-medium'>Nulls</th>
                        <th className='pb-1 pr-3 font-medium'>Unique</th>
                        <th className='pb-1 font-medium'>Stats / Top values</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
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
            <td className='py-1.5 pr-3 font-medium text-gray-800'>{col.name}</td>
            <td className='py-1.5 pr-3'><DTypeBadge dtype={col.dtype} /></td>
            <td className='py-1.5 pr-3 text-gray-500'>
                {col.nullPercent > 0
                    ? <span className='text-amber-600'>{col.nullPercent}%</span>
                    : '—'}
            </td>
            <td className='py-1.5 pr-3 text-gray-500'>{col.uniqueCount.toLocaleString()}</td>
            <td className='py-1.5 text-gray-500'>
                {isNumeric ? (
                    <span>
                        mean <span className='text-gray-700'>{col.mean}</span>
                        {' · '}min <span className='text-gray-700'>{col.min}</span>
                        {' · '}max <span className='text-gray-700'>{col.max}</span>
                        {col.median !== undefined && (
                            <> · median <span className='text-gray-700'>{col.median}</span></>
                        )}
                    </span>
                ) : col.topValues?.length ? (
                    col.topValues.map(({ value, count }) => (
                        <span key={value} className='mr-1.5'>
                            {value} <span className='text-gray-400'>({count})</span>
                        </span>
                    ))
                ) : (
                    col.sampleValues?.join(', ')
                )}
            </td>
        </tr>
    )
}

export function DocumentList() {
    const { data: documents, isLoading, isError } = trpc.documents.list.useQuery()
    const utils = trpc.useUtils()
    const deleteMutation = trpc.documents.delete.useMutation({
        onSuccess: () => utils.documents.list.invalidate(),
    })
    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    const toggle = (id: string) =>
        setExpanded((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })

    if (isLoading) return <p className='text-sm text-gray-500'>Loading documents...</p>
    if (isError) return <p className='text-sm text-red-500'>Failed to load documents.</p>
    if (!documents?.length) return <p className='text-sm text-gray-500'>No documents uploaded yet.</p>

    return (
        <ul className='divide-y divide-gray-200 rounded-lg border border-gray-200'>
            {documents.map((doc) => {
                const isOpen = expanded.has(doc.id)
                const meta = doc.metadata as DocumentMetadata | null

                return (
                    <li key={doc.id}>
                        <div className='flex items-center gap-3 px-4 py-3'>
                            {meta && (
                                <button
                                    onClick={() => toggle(doc.id)}
                                    className='shrink-0 text-gray-400 hover:text-gray-600'
                                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                                >
                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            )}
                            <div className='min-w-0 flex-1'>
                                <p className='truncate text-sm font-medium'>{doc.name}</p>
                                <p className='text-xs text-gray-500'>
                                    {doc.mimeType} · {formatBytes(doc.size)}
                                    {meta && (
                                        <> · {meta.rowCount.toLocaleString()} rows · {meta.columnCount} cols</>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteMutation.mutate({ id: doc.id })}
                                disabled={deleteMutation.isPending}
                                className='shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50'
                                aria-label='Delete document'
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        {isOpen && meta && <MetadataPanel meta={meta} />}
                    </li>
                )
            })}
        </ul>
    )
}
