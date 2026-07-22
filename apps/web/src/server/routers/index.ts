import { z } from 'zod'
import { publicProcedure, router } from '@/trpc/init'
import { documentsRouter } from './documents'
import { communityRouter } from './community'
import { commentsRouter } from './comments'
import { leadsRouter } from './leads'
import { adminApiKeysRouter } from './admin-api-keys'
import { adminAiUsageRouter } from './admin-ai-usage'

export const appRouter = router({
    health: publicProcedure.query(() => ({
        status: 'ok',
        timestamp: new Date(),
    })),
    hello: publicProcedure
        .input(z.object({ name: z.string().optional() }))
        .query(({ input }) => ({
            greeting: `Hello, ${input.name ?? 'world'}!`,
        })),
    documents: documentsRouter,
    community: communityRouter,
    comments: commentsRouter,
    leads: leadsRouter,
    admin: router({
        apiKeys: adminApiKeysRouter,
        aiUsage: adminAiUsageRouter,
    }),
})

export type AppRouter = typeof appRouter
