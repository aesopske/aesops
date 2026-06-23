import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, protectedProcedure, router } from '@/trpc/init'
import { db, comments, threads, users, and, asc, eq, count } from '@repo/db'

const entityType = z.enum(['discussion', 'blog'])

async function recountThread(threadId: string) {
    const [row] = await db
        .select({ value: count() })
        .from(comments)
        .where(
            and(
                eq(comments.entityType, 'discussion'),
                eq(comments.entityId, threadId),
            ),
        )
    await db
        .update(threads)
        .set({ replyCount: row?.value ?? 0 })
        .where(eq(threads.id, threadId))
}

export const commentsRouter = router({
    list: publicProcedure
        .input(z.object({ entityType, entityId: z.string() }))
        .query(async ({ input }) => {
            console.log(input)
            return db
                .select({
                    id: comments.id,
                    body: comments.body,
                    parentId: comments.parentId,
                    isAiResponse: comments.isAiResponse,
                    createdAt: comments.createdAt,
                    userId: comments.userId,
                    authorName: users.name,
                    authorImage: users.image,
                    authorUsername: users.username,
                })
                .from(comments)
                .leftJoin(users, eq(comments.userId, users.id))
                .where(
                    and(
                        eq(comments.entityType, input.entityType),
                        eq(comments.entityId, input.entityId),
                    ),
                )
                .orderBy(asc(comments.createdAt))
        }),

    count: publicProcedure
        .input(z.object({ entityType, entityId: z.string() }))
        .query(async ({ input }) => {
            const [row] = await db
                .select({ value: count() })
                .from(comments)
                .where(
                    and(
                        eq(comments.entityType, input.entityType),
                        eq(comments.entityId, input.entityId),
                    ),
                )
            return row?.value ?? 0
        }),

    create: protectedProcedure
        .input(
            z.object({
                entityType,
                entityId: z.string(),
                body: z.string().min(1).max(5000),
                parentId: z.string().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const [comment] = await db
                .insert(comments)
                .values({
                    entityType: input.entityType,
                    entityId: input.entityId,
                    userId: ctx.session.user.id,
                    parentId: input.parentId,
                    body: input.body,
                })
                .returning()

            if (input.entityType === 'discussion') {
                await recountThread(input.entityId)
                await db
                    .update(threads)
                    .set({ updatedAt: new Date() })
                    .where(eq(threads.id, input.entityId))
            }

            return comment
        }),

    delete: protectedProcedure
        .input(z.object({ commentId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [comment] = await db
                .select({
                    userId: comments.userId,
                    entityType: comments.entityType,
                    entityId: comments.entityId,
                })
                .from(comments)
                .where(eq(comments.id, input.commentId))
                .limit(1)

            if (!comment)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Comment not found',
                })
            if (comment.userId !== ctx.session.user.id)
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not own this comment',
                })

            // Postgres cascades to descendant comments via the self-FK
            await db.delete(comments).where(eq(comments.id, input.commentId))

            if (comment.entityType === 'discussion') {
                await recountThread(comment.entityId)
            }

            return { deleted: input.commentId }
        }),
})
