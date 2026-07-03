'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { trpc } from '@/trpc/react'
import { editFormSchema, type EditFormValues } from '@/lib/schemas/dataset'
import { RichTextEditor } from '@/components/shared/rich-text-editor'
import { LicenseSelect } from '@/components/shared/license-select'

type Doc = {
    id: string
    slug: string | null
    name: string
    description: unknown
    license: string | null
    source: string | null
}

export function EditForm({ doc }: { doc: Doc }) {
    const router = useRouter()
    const utils = trpc.useUtils()
    const updateMutation = trpc.documents.update.useMutation()

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            name: doc.name,
            description: doc.description ?? undefined,
            license: doc.license ?? '',
            source: doc.source ?? '',
        },
    })

    const onSubmit = async (values: EditFormValues) => {
        await updateMutation.mutateAsync({
            id: doc.id,
            name: values.name,
            description: values.description,
            license: values.license || undefined,
            source: values.source || undefined,
        })
        utils.documents.listMine.invalidate()
        router.push(`/datasets/${doc.slug ?? doc.id}`)
    }

    const busy = isSubmitting || updateMutation.isPending

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-1.5'>
                <label htmlFor='ds-name' className='block text-sm font-medium text-foreground'>
                    Dataset name
                </label>
                <input
                    id='ds-name'
                    type='text'
                    {...register('name')}
                    className='w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring/50'
                />
                {errors.name && (
                    <p className='text-xs text-destructive'>{errors.name.message}</p>
                )}
            </div>

            <div className='space-y-1.5'>
                <label className='block text-sm font-medium text-foreground'>
                    Description
                    <span className='ml-1 font-normal text-muted-foreground'>(optional)</span>
                </label>
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            initialContent={doc.description}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>

            <div className='space-y-1.5'>
                <label htmlFor='ds-license' className='block text-sm font-medium text-foreground'>
                    License
                </label>
                <Controller
                    name='license'
                    control={control}
                    render={({ field }) => (
                        <LicenseSelect id='ds-license' value={field.value ?? ''} onChange={field.onChange} />
                    )}
                />
            </div>

            <div className='space-y-1.5'>
                <label htmlFor='ds-source' className='block text-sm font-medium text-foreground'>
                    Source
                    <span className='ml-1 font-normal text-muted-foreground'>(optional)</span>
                </label>
                <input
                    id='ds-source'
                    type='text'
                    placeholder="e.g. a URL, an original dataset, or 'combined from X and Y'"
                    {...register('source')}
                    className='w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring/50'
                />
                <p className='text-xs text-muted-foreground'>
                    Where this dataset came from — a URL, the name of an original
                    dataset, or a note about how it was combined or derived.
                </p>
            </div>

            {updateMutation.error && (
                <p className='rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive'>
                    {updateMutation.error.message}
                </p>
            )}

            <div className='border-t border-border pt-6'>
                <div className='flex items-center justify-between'>
                    <Link
                        href={`/upload?revisionOf=${doc.id}`}
                        className='inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted'
                    >
                        <UploadCloud size={15} />
                        Upload new version
                    </Link>

                    <div className='flex items-center gap-3'>
                        <button
                            type='button'
                            onClick={() => router.push(`/datasets/${doc.slug ?? doc.id}`)}
                            className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={busy}
                            className='inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50'
                        >
                            <Save size={15} />
                            {busy ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
