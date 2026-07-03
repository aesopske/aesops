import { z } from 'zod'

export type { MetadataDiff } from '@repo/db/schema'

export const uploadFormSchema = z.object({
    name: z.string().min(1, 'Dataset name is required'),
    grouped: z.boolean(),
    description: z.unknown().optional(),
    license: z.string().optional(),
    source: z.string().optional(),
})

export type UploadFormValues = z.infer<typeof uploadFormSchema>

export const editFormSchema = z.object({
    name: z.string().min(1, 'Dataset name is required'),
    description: z.unknown().optional(),
    license: z.string().optional(),
    source: z.string().optional(),
})

export type EditFormValues = z.infer<typeof editFormSchema>
