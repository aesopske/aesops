import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { adminProcedure, router } from '@/trpc/init'
import { db, documents, eq } from '@repo/db'
import { documentService } from '@repo/storage'

export const adminDatasetsRouter = router({
    // Revisions currently held out of the query path pending human review —
    // see checkForAnomaly in dataset-pipeline.ts. No UI consumes this yet;
    // exposed now so a review page just needs to add the fetch.
    listPendingReview: adminProcedure.query(async () => {
        return db
            .select()
            .from(documents)
            .where(eq(documents.reviewStatus, 'pending_review'))
            .orderBy(documents.createdAt)
    }),

    // Discards a flagged revision entirely — the source's row drop was
    // spurious (scraper glitch, partial fetch), not real. Deletes the
    // document and its storage objects; the dataset falls back to whatever
    // revision was last `active`, untouched.
    rejectRevision: adminProcedure
        .input(z.object({ id: z.string().min(1) }))
        .mutation(async ({ input }) => {
            const doc = await documentService.getById(input.id)
            if (!doc) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
            }
            if (doc.reviewStatus !== 'pending_review') {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Only a pending-review revision can be rejected',
                })
            }
            await documentService.delete(doc.id)
            return { ok: true as const }
        }),
})
