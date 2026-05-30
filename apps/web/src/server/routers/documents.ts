import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, protectedProcedure, router } from '@/trpc/init'
import { documentService } from '@repo/storage'

export const documentsRouter = router({
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

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                description: z.string().optional(),
                license: z.string().optional(),
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
