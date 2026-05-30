'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloud, FileText, FileSpreadsheet, X } from 'lucide-react'

const ACCEPTED_TYPES = new Set([
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])
const ACCEPTED_EXTENSIONS = ['.csv', '.xls', '.xlsx']

function isAccepted(file: File) {
    if (ACCEPTED_TYPES.has(file.type)) return true
    return ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
}

function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type UploadZoneProps = {
    onFilesSelected: (files: File[]) => void
}

export function UploadZone({ onFilesSelected }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [staged, setStaged] = useState<File[]>([])
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    function stage(files: FileList | File[]) {
        const valid = [...files].filter(isAccepted)
        if (!valid.length) {
            setError('Only CSV and Excel files (.csv, .xls, .xlsx) are accepted.')
            return
        }

        const seen = new Set<string>(staged.map((f) => f.name))
        const added: File[] = []
        const skipped: string[] = []
        for (const file of valid) {
            if (seen.has(file.name)) skipped.push(file.name)
            else { seen.add(file.name); added.push(file) }
        }

        const next = [...staged, ...added]
        setStaged(next)
        setError(
            skipped.length
                ? `Skipped ${skipped.length} duplicate${skipped.length > 1 ? 's' : ''}: ${skipped.join(', ')}`
                : null,
        )
        onFilesSelected(next)
    }

    function remove(name: string) {
        const next = staged.filter((f) => f.name !== name)
        setStaged(next)
        onFilesSelected(next)
    }

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            stage(e.dataTransfer.files)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [staged],
    )

    return (
        <div className='space-y-3'>
            <div
                role='button'
                tabIndex={0}
                aria-label='Upload files'
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={[
                    'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer',
                    isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-ring hover:bg-secondary',
                ].join(' ')}
            >
                <UploadCloud size={28} className='text-muted-foreground' />
                <p className='text-sm font-medium text-foreground'>
                    {staged.length > 0 ? 'Drop more files to add them' : 'Drop files here or click to browse'}
                </p>
                <p className='text-xs text-muted-foreground'>CSV, XLS, XLSX · up to 32 MB</p>
            </div>

            <input
                ref={inputRef}
                type='file'
                multiple
                accept={ACCEPTED_EXTENSIONS.join(',')}
                className='hidden'
                onChange={(e) => { if (e.target.files) stage(e.target.files); e.target.value = '' }}
            />

            {error && <p className='text-xs text-destructive'>{error}</p>}

            {staged.length > 0 && (
                <ul className='divide-y divide-border rounded-lg border border-border'>
                    {staged.map((file) => {
                        const isExcel = file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
                        return (
                            <li key={file.name} className='flex items-center gap-3 px-3 py-2.5'>
                                <span className={`shrink-0 ${isExcel ? 'text-success' : 'text-primary'}`}>
                                    {isExcel ? <FileSpreadsheet size={16} /> : <FileText size={16} />}
                                </span>
                                <span className='min-w-0 flex-1 truncate text-sm text-foreground'>{file.name}</span>
                                <span className='shrink-0 text-xs text-muted-foreground'>{formatBytes(file.size)}</span>
                                <button
                                    type='button'
                                    onClick={() => remove(file.name)}
                                    className='shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X size={14} />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
