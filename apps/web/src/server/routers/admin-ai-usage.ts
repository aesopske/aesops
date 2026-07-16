import { z } from 'zod'
import { subDays } from 'date-fns'
import { adminProcedure, router } from '@/trpc/init'
import { db, aiUsageEvents, and, desc, eq, gte, sql, count } from '@repo/db'

const usageWindowInput = z.object({
    days: z.number().int().min(1).max(365).default(30),
})

export const adminAiUsageRouter = router({
    // Per-route totals over the trailing window — requests, success rate,
    // tokens, avg latency. Powers both the stat tiles (summed across routes)
    // and the route-breakdown table.
    byRoute: adminProcedure.input(usageWindowInput).query(async ({ input }) => {
        const since = subDays(new Date(), input.days)
        const rows = await db
            .select({
                route: aiUsageEvents.route,
                requests: count(),
                successCount: sql<number>`count(*) filter (where ${aiUsageEvents.success})::int`,
                totalTokens: sql<number>`coalesce(sum(${aiUsageEvents.totalTokens}), 0)::int`,
                avgLatencyMs: sql<number>`coalesce(avg(${aiUsageEvents.latencyMs}), 0)::int`,
            })
            .from(aiUsageEvents)
            .where(gte(aiUsageEvents.createdAt, since))
            .groupBy(aiUsageEvents.route)
            .orderBy(aiUsageEvents.route)
        return rows
    }),

    // Daily request + error counts per route, for the trend chart.
    daily: adminProcedure.input(usageWindowInput).query(async ({ input }) => {
        const since = subDays(new Date(), input.days)
        const bucket = sql<string>`date_trunc('day', ${aiUsageEvents.createdAt})`
        const rows = await db
            .select({
                bucketStart: bucket.as('bucket_start'),
                route: aiUsageEvents.route,
                requests: count(),
                errors: sql<number>`count(*) filter (where not ${aiUsageEvents.success})::int`,
            })
            .from(aiUsageEvents)
            .where(gte(aiUsageEvents.createdAt, since))
            .groupBy(sql`bucket_start`, aiUsageEvents.route)
            .orderBy(sql`bucket_start`)

        return rows.map((r) => ({
            bucketStart: new Date(r.bucketStart),
            route: r.route,
            requests: r.requests,
            errors: r.errors,
        }))
    }),

    // Most recent failed requests in the window — so a raised error rate can
    // actually be diagnosed, not just observed.
    recentErrors: adminProcedure
        .input(usageWindowInput.extend({ limit: z.number().int().min(1).max(100).default(20) }))
        .query(async ({ input }) => {
            const since = subDays(new Date(), input.days)
            const rows = await db
                .select({
                    id: aiUsageEvents.id,
                    route: aiUsageEvents.route,
                    model: aiUsageEvents.model,
                    errorMessage: aiUsageEvents.errorMessage,
                    createdAt: aiUsageEvents.createdAt,
                })
                .from(aiUsageEvents)
                .where(
                    and(
                        eq(aiUsageEvents.success, false),
                        gte(aiUsageEvents.createdAt, since),
                    ),
                )
                .orderBy(desc(aiUsageEvents.createdAt))
                .limit(input.limit)
            return rows
        }),
})
