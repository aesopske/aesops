import { z } from 'zod'
import { publicProcedure, router } from '@/trpc/init'
import { db, leads, eq } from '@repo/db'
import { sendLeadNotification } from '@repo/email'
import { leadSourceSchema, serviceInterestSchema } from '@/lib/schemas/lead'

export const leadsRouter = router({
    submit: publicProcedure
        .input(
            z.object({
                source: leadSourceSchema,
                name: z.string().min(1).max(200),
                email: z.string().email(),
                company: z.string().max(200).optional(),
                phone: z.string().max(50).optional(),
                serviceInterest: serviceInterestSchema.optional(),
                message: z.string().min(1).max(5000),
                // real users never fill this in — a non-empty value marks the
                // submission as a bot, handled below (not via schema validation,
                // so it fails silently instead of returning a 400 that would
                // tip bots off to the honeypot)
                honeypot: z.string().max(200).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            if (input.honeypot) return { ok: true }

            const values = {
                source: input.source,
                name: input.name,
                email: input.email,
                company: input.company,
                phone: input.phone,
                serviceInterest: input.serviceInterest,
                message: input.message,
            }

            const [lead] = await db.insert(leads).values(values).returning()

            try {
                await sendLeadNotification(values)
                if (lead) {
                    await db
                        .update(leads)
                        .set({ emailNotified: true })
                        .where(eq(leads.id, lead.id))
                }
            } catch (error) {
                console.error('Failed to send lead notification email', error)
            }

            return { ok: true }
        }),
})
