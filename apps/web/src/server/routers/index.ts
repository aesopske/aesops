import { z } from 'zod'
import { publicProcedure, router } from '@/trpc/init'
import { documentsRouter } from './documents'

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
})

export type AppRouter = typeof appRouter
