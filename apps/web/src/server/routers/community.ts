import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { groq } from 'next-sanity'
import { publicProcedure, protectedProcedure, router } from '@/trpc/init'
import {
    db,
    threads,
    users,
    documents,
    and,
    or,
    desc,
    asc,
    eq,
    gte,
    isNull,
    isNotNull,
    ilike,
    count,
} from '@repo/db'
import { sanityFetch } from '~sanity/utils/fetch'

type SanityPost = {
    _id: string
    title: string
    slug: { current: string } | null
}

function recencyStart(
    recency: 'all' | 'today' | '7d' | '30d' | 'year',
): Date | null {
    if (recency === 'all') return null
    const now = new Date()
    if (recency === 'today') {
        const d = new Date(now)
        d.setHours(0, 0, 0, 0)
        return d
    }
    const days = recency === '7d' ? 7 : recency === '30d' ? 30 : 365
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

function makeThreadSlug(title: string, id: string): string {
    const base = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/, '')
        .slice(0, 60)
        .replace(/-+$/, '')
    return `${base}-${id.slice(0, 8)}`
}

export const communityRouter = router({
    countThreads: publicProcedure.query(async () => {
        const [row] = await db.select({ value: count() }).from(threads)
        return row?.value ?? 0
    }),

    listThreads: publicProcedure
        .input(
            z.object({
                query: z.string().optional(),
                source: z
                    .enum(['all', 'dataset', 'blog', 'none'])
                    .default('all'),
                datasetId: z.string().optional(),
                recency: z
                    .enum(['all', 'today', '7d', '30d', 'year'])
                    .default('all'),
                sort: z
                    .enum(['newest', 'oldest', 'mostReplies'])
                    .default('newest'),
                limit: z.number().min(1).max(50).default(20),
                offset: z.number().min(0).default(0),
            }),
        )
        .query(async ({ input }) => {
            const { query, source, datasetId, recency, sort, limit, offset } =
                input

            const conditions = []
            if (query) {
                const q = `%${query}%`
                conditions.push(
                    or(ilike(threads.title, q), ilike(threads.body, q)),
                )
            }
            const start = recencyStart(recency)
            if (start) conditions.push(gte(threads.createdAt, start))
            if (source === 'dataset')
                conditions.push(isNotNull(threads.linkedDatasetId))
            else if (source === 'blog')
                conditions.push(isNotNull(threads.linkedBlogId))
            else if (source === 'none')
                conditions.push(
                    and(
                        isNull(threads.linkedDatasetId),
                        isNull(threads.linkedBlogId),
                    ),
                )
            if (datasetId)
                conditions.push(eq(threads.linkedDatasetId, datasetId))

            const orderBy =
                sort === 'oldest'
                    ? asc(threads.createdAt)
                    : sort === 'mostReplies'
                      ? desc(threads.replyCount)
                      : desc(threads.createdAt)

            const rows = await db
                .select({
                    id: threads.id,
                    slug: threads.slug,
                    title: threads.title,
                    body: threads.body,
                    replyCount: threads.replyCount,
                    createdAt: threads.createdAt,
                    linkedDatasetId: threads.linkedDatasetId,
                    linkedDatasetSlug: threads.linkedDatasetSlug,
                    linkedDatasetName: threads.linkedDatasetName,
                    linkedBlogId: threads.linkedBlogId,
                    linkedBlogSlug: threads.linkedBlogSlug,
                    linkedBlogTitle: threads.linkedBlogTitle,
                    authorName: users.name,
                    authorImage: users.image,
                    authorUsername: users.username,
                })
                .from(threads)
                .leftJoin(users, eq(threads.userId, users.id))
                .where(conditions.length ? and(...conditions) : undefined)
                .orderBy(orderBy)
                .limit(limit + 1)
                .offset(offset)

            const hasMore = rows.length > limit
            const items = hasMore ? rows.slice(0, limit) : rows
            const nextOffset = hasMore ? offset + limit : null

            return { items, nextOffset }
        }),

    getThread: publicProcedure
        .input(z.object({ threadId: z.string() }))
        .query(async ({ input }) => {
            const [thread] = await db
                .select({
                    id: threads.id,
                    slug: threads.slug,
                    title: threads.title,
                    body: threads.body,
                    replyCount: threads.replyCount,
                    createdAt: threads.createdAt,
                    userId: threads.userId,
                    linkedDatasetId: threads.linkedDatasetId,
                    linkedDatasetSlug: threads.linkedDatasetSlug,
                    linkedDatasetName: threads.linkedDatasetName,
                    linkedBlogId: threads.linkedBlogId,
                    linkedBlogSlug: threads.linkedBlogSlug,
                    linkedBlogTitle: threads.linkedBlogTitle,
                    authorName: users.name,
                    authorImage: users.image,
                    authorUsername: users.username,
                })
                .from(threads)
                .leftJoin(users, eq(threads.userId, users.id))
                .where(
                    or(
                        eq(threads.slug, input.threadId),
                        eq(threads.id, input.threadId),
                    ),
                )

            if (!thread)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Thread not found',
                })

            return { thread }
        }),

    createThread: protectedProcedure
        .input(
            z.object({
                title: z.string().min(5).max(200),
                body: z.string().min(10).max(10000),
                linkedDatasetId: z.string().optional(),
                linkedDatasetSlug: z.string().optional(),
                linkedDatasetName: z.string().optional(),
                linkedBlogId: z.string().optional(),
                linkedBlogSlug: z.string().optional(),
                linkedBlogTitle: z.string().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            if (input.linkedDatasetId) {
                const [doc] = await db
                    .select({ id: documents.id })
                    .from(documents)
                    .where(eq(documents.id, input.linkedDatasetId))
                    .limit(1)
                if (!doc)
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Dataset not found',
                    })
            }

            const id = crypto.randomUUID()
            const slug = makeThreadSlug(input.title, id)

            const [thread] = await db
                .insert(threads)
                .values({
                    id,
                    slug,
                    userId: ctx.session.user.id,
                    title: input.title,
                    body: input.body,
                    linkedDatasetId: input.linkedDatasetId,
                    linkedDatasetSlug: input.linkedDatasetSlug,
                    linkedDatasetName: input.linkedDatasetName,
                    linkedBlogId: input.linkedBlogId,
                    linkedBlogSlug: input.linkedBlogSlug,
                    linkedBlogTitle: input.linkedBlogTitle,
                })
                .returning()

            return thread
        }),

    deleteThread: protectedProcedure
        .input(z.object({ threadId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [thread] = await db
                .select({ userId: threads.userId })
                .from(threads)
                .where(eq(threads.id, input.threadId))
                .limit(1)

            if (!thread)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Thread not found',
                })
            if (thread.userId !== ctx.session.user.id)
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not own this thread',
                })

            await db.delete(threads).where(eq(threads.id, input.threadId))
            return { deleted: input.threadId }
        }),

    listThreadsByDataset: publicProcedure
        .input(
            z.object({
                datasetId: z.string(),
                limit: z.number().min(1).max(20).default(5),
            }),
        )
        .query(async ({ input }) => {
            return db
                .select({
                    id: threads.id,
                    slug: threads.slug,
                    title: threads.title,
                    replyCount: threads.replyCount,
                    createdAt: threads.createdAt,
                })
                .from(threads)
                .where(eq(threads.linkedDatasetId, input.datasetId))
                .orderBy(desc(threads.createdAt))
                .limit(input.limit)
        }),

    listBlogPosts: publicProcedure.query(async () => {
        const posts = await sanityFetch<SanityPost[]>({
            query: groq`*[_type == "page" && pageType == "blog"] | order(publishedAt desc) { _id, title, slug }`,
        })
        return (posts ?? []).map((p) => ({
            id: p._id,
            title: p.title,
            slug: p.slug?.current ?? '',
        }))
    }),
})
