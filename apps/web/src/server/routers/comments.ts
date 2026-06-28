import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, protectedProcedure, router } from '@/trpc/init'
import { db, comments, commentVotes, threads, users, and, asc, eq, count, sql } from '@repo/db'

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
        .input(z.object({ entityType, entityId: z.string(), currentUserId: z.string().optional() }))
        .query(async ({ input }) => {
            const rows = await db
                .select({
                    id: comments.id,
                    body: comments.body,
                    parentId: comments.parentId,
                    isAiResponse: comments.isAiResponse,
                    createdAt: comments.createdAt,
                    userId: comments.userId,
                    voteScore: comments.voteScore,
                    authorName: users.name,
                    authorImage: users.image,
                    authorUsername: users.username,
                    userVote: input.currentUserId
                        ? sql<number | null>`(
                            SELECT value FROM comment_votes
                            WHERE user_id = ${input.currentUserId}
                              AND comment_id = ${comments.id}
                            LIMIT 1
                          )`
                        : sql<null>`NULL`,
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

            return rows.map((r) => ({
                ...r,
                userVote: (r.userVote as 1 | -1 | null) ?? null,
            }))
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

            // Enrich with author + vote fields so the optimistic UI insert matches
            // the shape returned by `list` — without this the fresh comment
            // renders as "Anonymous" with stale vote state until a refetch.
            return {
                ...comment,
                authorName: ctx.session.user.name ?? null,
                authorImage: ctx.session.user.image ?? null,
                authorUsername: ctx.session.user.username ?? null,
                voteScore: 0,
                userVote: null as 1 | -1 | null,
            }
        }),

    vote: protectedProcedure
        .input(
            z.object({
                commentId: z.string(),
                value: z.union([z.literal(1), z.literal(-1)]),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const [existing] = await db
                .select({ value: commentVotes.value })
                .from(commentVotes)
                .where(
                    and(
                        eq(commentVotes.userId, ctx.session.user.id),
                        eq(commentVotes.commentId, input.commentId),
                    ),
                )
                .limit(1)

            let scoreDelta = 0
            let userVote: 1 | -1 | null = null

            if (existing) {
                if (existing.value === input.value) {
                    // Same vote → toggle off
                    await db
                        .delete(commentVotes)
                        .where(
                            and(
                                eq(commentVotes.userId, ctx.session.user.id),
                                eq(commentVotes.commentId, input.commentId),
                            ),
                        )
                    scoreDelta = -input.value
                    userVote = null
                } else {
                    // Opposite vote → flip
                    await db
                        .update(commentVotes)
                        .set({ value: input.value })
                        .where(
                            and(
                                eq(commentVotes.userId, ctx.session.user.id),
                                eq(commentVotes.commentId, input.commentId),
                            ),
                        )
                    scoreDelta = input.value * 2
                    userVote = input.value
                }
            } else {
                // New vote
                await db.insert(commentVotes).values({
                    userId: ctx.session.user.id,
                    commentId: input.commentId,
                    value: input.value,
                })
                scoreDelta = input.value
                userVote = input.value
            }

            const [updated] = await db
                .update(comments)
                .set({ voteScore: sql`${comments.voteScore} + ${scoreDelta}` })
                .where(eq(comments.id, input.commentId))
                .returning({ voteScore: comments.voteScore })

            return { voteScore: updated?.voteScore ?? 0, userVote }
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
