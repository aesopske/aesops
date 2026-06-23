import { z } from 'zod'
import { publicProcedure, router } from '@/trpc/init'
import { documentsRouter } from './documents'
import { communityRouter } from './community'
import { commentsRouter } from './comments'

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
})

export type AppRouter = typeof appRouter
