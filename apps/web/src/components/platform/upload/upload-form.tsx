'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/trpc/react'
import { extractMetadata } from '@/lib/platform/metadata'
import { uploadFormSchema, type UploadFormValues } from '@/lib/schemas/dataset'
import { LICENSES } from '@/lib/constants/licenses'
import { RichTextEditor } from '@/components/shared/rich-text-editor'
import { Toggle } from '@/components/shared/toggle'

export { LICENSES }

function defaultName(files: File[]) {
    if (files.length === 1) return files[0]!.name.replace(/\.[^.]+$/, '')
    return ''
}

const CONTENT_TYPES = {
    csv: 'text/csv',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
} as const

type AllowedContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES]

// Browsers report inconsistent MIME types for CSV/Excel; derive from the
// extension so it always matches the values the server accepts.
function resolveContentType(file: File): AllowedContentType {
    const allowed = Object.values(CONTENT_TYPES) as string[]
    if (allowed.includes(file.type)) return file.type as AllowedContentType
    const ext = file.name.toLowerCase().split('.').pop() ?? ''
    return CONTENT_TYPES[ext as keyof typeof CONTENT_TYPES] ?? CONTENT_TYPES.csv
}

type UploadFormProps = {
    files: File[]
    parentId?: string
    lockedName?: string
    onComplete: () => void
    onCancel: () => void
}

export function UploadForm({ files, parentId, lockedName, onComplete, onCancel }: UploadFormProps) {
    const utils = trpc.useUtils()
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const isMultiple = files.length > 1

    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UploadFormValues>({
        resolver: zodResolver(uploadFormSchema),
        defaultValues: {
            name: lockedName ?? defaultName(files),
            grouped: isMultiple,
            description: undefined,
            license: '',
        },
    })

    const grouped = watch('grouped')
    const showNameField = !isMultiple || grouped
    const isRevision = !!parentId

    const onSubmit = async (values: UploadFormValues) => {
        setUploadError(null)
        setIsUploading(true)
        try {
            const groupId =
                values.grouped && files.length > 1 ? crypto.randomUUID() : undefined

            for (const file of files) {
                const buffer = await file.arrayBuffer()
                const metadata = extractMetadata(buffer)
                const contentType = resolveContentType(file)

                const presigned = await utils.client.documents.createUpload.mutate({
                    fileName: file.name,
                    contentType,
                    size: file.size,
                })

                const putRes = await fetch(presigned.url, {
                    method: 'PUT',
                    headers: presigned.headers,
                    body: file,
                })
                if (!putRes.ok) {
                    throw new Error('Upload failed while sending the file to storage.')
                }

                const registered = await utils.client.documents.register.mutate({
                    key: presigned.key,
                    objectUrl: presigned.objectUrl,
                    fileName: file.name,
                    size: file.size,
                    contentType,
                    name: values.name,
                    grouped: values.grouped,
                    description: values.description,
                    license: values.license,
                    groupId,
                    parentId,
                    metadata,
                })

                const docName = values.grouped ? values.name : file.name
                fetch('/api/ai/insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        documentId: registered.documentId,
                        docName,
                        metadata,
                    }),
                }).catch(() => {})

                // Generate the derived Parquet artifact (query substrate) in the
                // background; the dataset is usable from the original file meanwhile.
                fetch(`/api/datasets/${registered.documentId}/parquet`, {
                    method: 'POST',
                }).catch(() => {})
            }

            utils.documents.list.invalidate()
            utils.documents.listMineRoots.invalidate()
            onComplete()
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed.')
        } finally {
            setIsUploading(false)
        }
    }

    const busy = isSubmitting || isUploading

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {showNameField ? (
                <div className='space-y-1.5'>
                    <label htmlFor='ds-name' className='block text-sm font-medium text-foreground'>
                        Dataset name
                    </label>
                    <input
                        id='ds-name'
                        type='text'
                        readOnly={isRevision}
                        placeholder={isMultiple ? 'e.g. Climate Survey 2024' : 'Dataset name'}
                        {...register('name')}
                        className={`w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none transition ${
                            isRevision
                                ? 'cursor-default bg-muted text-muted-foreground'
                                : 'bg-transparent focus:border-ring focus:ring-1 focus:ring-ring/50'
                        }`}
                    />
                    {errors.name && (
                        <p className='text-xs text-destructive'>{errors.name.message}</p>
                    )}
                </div>
            ) : (
                <p className='text-sm text-muted-foreground'>
                    Each file will be saved under its original filename.
                </p>
            )}

            {isMultiple && !isRevision && (
                <div className='flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary px-4 py-3'>
                    <div>
                        <p className='text-sm font-medium text-foreground'>Group as one dataset</p>
                        <p className='mt-0.5 text-xs text-muted-foreground'>
                            Link all {files.length} files under a single dataset entry.
                        </p>
                    </div>
                    <Controller
                        name='grouped'
                        control={control}
                        render={({ field }) => (
                            <Toggle checked={field.value} onChange={field.onChange} />
                        )}
                    />
                </div>
            )}

            <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-foreground'>
                    Description
                    <span className='ml-1 font-normal text-muted-foreground'>(optional)</span>
                </label>
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => <RichTextEditor onChange={field.onChange} />}
                />
            </div>

            <div className='space-y-1.5'>
                <label htmlFor='ds-license' className='block text-sm font-medium text-foreground'>
                    License
                </label>
                <select
                    id='ds-license'
                    {...register('license')}
                    className='w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring/50'
                >
                    {LICENSES.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                </select>
            </div>

            {uploadError && (
                <p className='rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive'>
                    {uploadError}
                </p>
            )}

            <div className='flex items-center justify-between pt-2'>
                <button
                    type='button'
                    onClick={onCancel}
                    disabled={busy}
                    className='text-sm text-muted-foreground hover:text-foreground disabled:opacity-40'
                >
                    ← Change files
                </button>
                <button
                    type='submit'
                    disabled={busy}
                    className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                >
                    {busy ? 'Uploading…' : `Upload ${files.length === 1 ? 'dataset' : `${files.length} files`}`}
                </button>
            </div>
        </form>
    )
}
