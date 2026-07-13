import { z } from 'zod'
import { auth } from '@repo/auth'
import { adminProcedure, router } from '@/trpc/init'

// API keys for programmatic access (currently the scraper upload endpoint,
// see `/api/scraper/upload`). Admin-only: keys are always minted for the
// signed-in admin themself, scoped to `datasets: ['write']`.
type ApiKeySummary = {
    id: string
    name: string | null
    start: string | null
    prefix: string | null
    enabled: boolean
    createdAt: Date
    lastRequest: Date | null
}

export const adminApiKeysRouter = router({
    list: adminProcedure.query(async ({ ctx }): Promise<ApiKeySummary[]> => {
        const result = await auth.api.listApiKeys({ headers: ctx.headers })
        return result.apiKeys.map((k: ApiKeySummary) => ({
            id: k.id,
            name: k.name,
            start: k.start,
            prefix: k.prefix,
            enabled: k.enabled,
            createdAt: k.createdAt,
            lastRequest: k.lastRequest,
        }))
    }),

    create: adminProcedure
        .input(z.object({ name: z.string().min(1).max(32) }))
        .mutation(async ({ input, ctx }): Promise<{ id: string; key: string; name: string | null }> => {
            const created = await auth.api.createApiKey({
                body: {
                    name: input.name,
                    userId: ctx.session.user.id,
                    permissions: { datasets: ['write'] },
                },
            })
            return { id: created.id, key: created.key, name: created.name }
        }),

    revoke: adminProcedure
        .input(z.object({ keyId: z.string().min(1) }))
        .mutation(async ({ input, ctx }): Promise<{ success: boolean }> => {
            const result = await auth.api.deleteApiKey({
                body: { keyId: input.keyId },
                headers: ctx.headers,
            })
            return { success: result.success }
        }),
})
