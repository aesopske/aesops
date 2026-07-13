import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, protectedProcedure, router } from '@/trpc/init'
import { documentService } from '@repo/storage'
import { db, chatMessages, and, eq, desc } from '@repo/db'
import type { DocumentMetadata } from '@repo/db/schema'
import { computeMetadataDiff } from '@/lib/platform/metadata-diff'
import {
    ALLOWED_MIME,
    MAX_UPLOAD_BYTES,
    safeKeySegment,
    stripExtension,
} from '@/lib/platform/document-naming'

const MIN_DISTINCT_ASKERS = 2

function normalizeQuestion(content: string): string {
    return content.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[?!.]+$/, '')
}

export const documentsRouter = router({
    // Presign a direct-to-R2 upload. The client PUTs bytes to `uploadUrl`, then
    // calls `register` to persist the document row.
    createUpload: protectedProcedure
        .input(
            z.object({
                fileName: z.string().min(1),
                contentType: z.enum(ALLOWED_MIME),
                size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const key = `datasets/${ctx.session.user.id}/${crypto.randomUUID()}/${safeKeySegment(input.fileName)}`
            const presigned = await documentService.createUploadUrl({
                key,
                contentType: input.contentType,
                contentLength: input.size,
            })
            return presigned
        }),

    // Persist a document after its bytes have been uploaded to R2.
    register: protectedProcedure
        .input(
            z.object({
                key: z.string().min(1),
                objectUrl: z.string().min(1),
                fileName: z.string().min(1),
                size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
                contentType: z.enum(ALLOWED_MIME),
                name: z.string().min(1),
                grouped: z.boolean(),
                description: z.any().optional(),
                license: z.string().nullish(),
                source: z.string().nullish(),
                groupId: z.string().nullish(),
                parentId: z.string().nullish(),
                metadata: z.any().nullish(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const fileMetadata = (input.metadata ?? null) as DocumentMetadata | null

            // The name field reflects user intent (typed name, or the parent's
            // locked name for a revision); fall back to the raw filename only
            // when it's blank, e.g. independent multi-file uploads.
            const typedName = input.name.trim()
            let docName = stripExtension(typedName.length > 0 ? typedName : input.fileName)

            if (input.parentId) {
                const revisions = await documentService.listRevisions(input.parentId)
                const versionNumber = revisions.length + 2
                docName = `${docName} v${versionNumber}`
            }

            const metadataDiff =
                input.parentId && fileMetadata
                    ? await (async () => {
                          const parent = await documentService
                              .getById(input.parentId!)
                              .catch(() => null)
                          if (!parent?.metadata) return null
                          return computeMetadataDiff(
                              parent.metadata as DocumentMetadata,
                              fileMetadata,
                          )
                      })()
                    : null

            const doc = await documentService.create({
                name: docName,
                url: input.objectUrl,
                storageKey: input.key,
                size: input.size,
                mimeType: input.contentType,
                provider: 'r2',
                uploadedBy: ctx.session.user.id,
                metadata: fileMetadata,
                description: input.description,
                license: input.license ?? null,
                source: input.source ?? null,
                groupId: input.groupId ?? null,
                aiInsights: null,
                parentId: input.parentId ?? null,
                metadataDiff,
            })
            return { documentId: doc.id, fileName: input.fileName }
        }),

    list: publicProcedure
        .input(z.object({ query: z.string().optional() }).optional())
        .query(({ input }) =>
            input?.query
                ? documentService.search(input.query)
                : documentService.list(),
        ),

    listMine: protectedProcedure
        .input(z.object({ query: z.string().optional() }).optional())
        .query(({ input, ctx }) => {
            const userId = ctx.session.user.id
            return input?.query
                ? documentService.searchByUser(input.query, userId)
                : documentService.listByUser(userId)
        }),

    listMineRoots: protectedProcedure
        .query(({ ctx }) => documentService.listByUserRoots(ctx.session.user.id)),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            // Accept either a UUID (id) or a human-readable slug
            const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            const doc = UUID_RE.test(input.id)
                ? await documentService.getById(input.id)
                : (await documentService.getBySlug(input.id)) ??
                  (await documentService.getById(input.id))
            if (!doc)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Document not found',
                })
            return doc
        }),

    listRevisions: publicProcedure
        .input(z.object({ parentId: z.string() }))
        .query(({ input }) => documentService.listRevisions(input.parentId)),

    // Questions other users have asked about this dataset, for chat suggestions.
    // Only surfaces a question once it's been asked by 2+ distinct users, so a
    // single chatty user (or a one-off odd query) can't dominate the list.
    topQuestions: publicProcedure
        .input(
            z.object({
                datasetId: z.string(),
                limit: z.number().int().min(1).max(10).default(4),
            }),
        )
        .query(async ({ input }) => {
            const rows = await db
                .select({
                    content: chatMessages.content,
                    userId: chatMessages.userId,
                    createdAt: chatMessages.createdAt,
                })
                .from(chatMessages)
                .where(
                    and(
                        eq(chatMessages.datasetId, input.datasetId),
                        eq(chatMessages.role, 'user'),
                    ),
                )
                .orderBy(desc(chatMessages.createdAt))
                .limit(500)

            const groups = new Map<
                string,
                { question: string; createdAt: Date; userIds: Set<string> }
            >()

            for (const row of rows) {
                const key = normalizeQuestion(row.content)
                if (!key) continue
                const existing = groups.get(key)
                if (existing) {
                    existing.userIds.add(row.userId)
                } else {
                    groups.set(key, {
                        question: row.content.trim(),
                        createdAt: row.createdAt,
                        userIds: new Set([row.userId]),
                    })
                }
            }

            return Array.from(groups.values())
                .filter((g) => g.userIds.size >= MIN_DISTINCT_ASKERS)
                .sort(
                    (a, b) =>
                        b.userIds.size - a.userIds.size ||
                        b.createdAt.getTime() - a.createdAt.getTime(),
                )
                .slice(0, input.limit)
                .map((g) => ({ question: g.question, count: g.userIds.size }))
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                description: z.string().optional(),
                license: z.string().optional(),
                source: z.string().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const doc = await documentService.getById(input.id)
            if (!doc)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Document not found',
                })
            if (doc.uploadedBy !== ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not own this document',
                })
            }
            return documentService.update(input.id, {
                name: input.name,
                description: input.description,
                license: input.license,
                source: input.source,
            })
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const doc = await documentService.getById(input.id)
            if (!doc)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Document not found',
                })
            if (doc.uploadedBy && doc.uploadedBy !== ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not own this document',
                })
            }
            await documentService.delete(input.id)
            return { deleted: input.id }
        }),
})
