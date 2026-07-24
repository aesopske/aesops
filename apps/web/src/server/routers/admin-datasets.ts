import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { adminProcedure, router } from '@/trpc/init'
import { db, documents, eq } from '@repo/db'
import { documentService } from '@repo/storage'
import { diffVersions } from '@/lib/platform/dataset-diff'

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

    // Row-level diff against the revision a pending upload was compared
    // against, so a reviewer can see exactly which rows the anomaly check
    // flagged as missing before deciding whether to reject. Only meaningful
    // for a 'row_drop' anomaly — a 'check_failed' one has no completed diff
    // to show (that's exactly why it's pending).
    diffAgainstPrevious: adminProcedure
        .input(z.object({ id: z.string().min(1) }))
        .query(async ({ input }) => {
            const doc = await documentService.getById(input.id)
            if (!doc) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Document not found' })
            }
            const anomaly = doc.anomalyDetails
            if (!anomaly || anomaly.reason !== 'row_drop') {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'No completed diff available for this revision',
                })
            }
            const previousDoc = await documentService.getById(anomaly.previousDocId)
            if (!previousDoc) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Previous revision not found' })
            }
            const diff = await diffVersions(previousDoc, doc)
            if (!diff) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Unable to compute diff' })
            }
            return diff
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
