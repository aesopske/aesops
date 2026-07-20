'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
    page: number
    totalPages: number
    shown: number
    total: number
    onPageChange: (page: number) => void
}

export function DatasetPagination({
    page,
    totalPages,
    shown,
    total,
    onPageChange,
}: Props) {
    if (totalPages <= 1) return null

    return (
        <div className='flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3'>
            <span className='text-xs text-muted-foreground'>
                Showing{' '}
                <span className='font-semibold text-foreground'>{shown}</span> of{' '}
                <span className='font-semibold text-foreground'>{total}</span>{' '}
                datasets
            </span>
            <div className='flex items-center gap-3'>
                <button
                    type='button'
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className='flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'
                    aria-label='Previous page'>
                    <ChevronLeft size={14} />
                </button>
                <span className='text-xs text-muted-foreground'>
                    Page <span className='font-semibold text-foreground'>{page}</span>{' '}
                    of {totalPages}
                </span>
                <button
                    type='button'
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className='flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'
                    aria-label='Next page'>
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    )
}
