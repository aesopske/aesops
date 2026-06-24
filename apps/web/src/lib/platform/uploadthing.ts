import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'
import type { DocumentMetadata } from '@repo/db/schema'
import { computeMetadataDiff } from '@/lib/platform/metadata-diff'

const f = createUploadthing()

type UploadedFile = {
    name: string
    ufsUrl: string
    key: string
    size: number
    type: string
}

export const fileRouter = {
    documentUploader: f({
        'text/csv': { maxFileSize: '32MB', maxFileCount: 10 },
        'application/vnd.ms-excel': { maxFileSize: '32MB', maxFileCount: 5 },
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
            maxFileSize: '32MB',
            maxFileCount: 5,
        },
    })
        .input(
            z.object({
                name: z.string().min(1),
                grouped: z.boolean(),
                description: z.unknown().optional(),
                license: z.string().optional(),
                groupId: z.string().uuid().optional(),
                parentId: z.string().uuid().optional(),
                files: z.record(z.record(z.unknown())),
            }),
        )
        .middleware(async ({ req, input }) => {
            type Input = {
                name: string
                grouped: boolean
                description: unknown
                license?: string
                groupId?: string
                parentId?: string
                files: Record<string, Record<string, unknown>>
            }
            const i = input as Input
            const session = await auth.api.getSession({ headers: req.headers })
            return {
                uploadedBy: session?.user.id ?? null,
                name: i.name,
                grouped: i.grouped,
                description: i.description,
                license: i.license ?? null,
                groupId: i.groupId ?? null,
                parentId: i.parentId ?? null,
                filesMetadata: i.files,
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const f = file as unknown as UploadedFile
            const fileMetadata = (metadata.filesMetadata[f.name] ?? null) as DocumentMetadata | null
            const docName = metadata.grouped ? metadata.name : f.name

            const metadataDiff = await (async () => {
                if (!metadata.parentId || !fileMetadata) return null
                const parent = await documentService.getById(metadata.parentId).catch(() => null)
                if (!parent?.metadata) return null
                return computeMetadataDiff(parent.metadata as DocumentMetadata, fileMetadata)
            })()

            const doc = await documentService.create({
                name: docName,
                url: f.ufsUrl,
                storageKey: f.key,
                size: f.size,
                mimeType: f.type,
                uploadedBy: metadata.uploadedBy,
                metadata: fileMetadata,
                description: metadata.description,
                license: metadata.license,
                groupId: metadata.groupId,
                aiInsights: null,
                parentId: metadata.parentId,
                metadataDiff,
            })
            return { documentId: doc.id, url: doc.url, fileName: f.name }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter
