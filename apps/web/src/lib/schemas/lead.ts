import { z } from 'zod'

export const leadSourceSchema = z.enum(['consultation', 'contact'])

export const serviceInterestSchema = z.enum([
    'market_intelligence',
    'custom_bi',
    'predictive_analytics',
    'data_pipeline',
    'other',
])

export const leadFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200),
    email: z.string().email('Enter a valid email address'),
    company: z.string().max(200).optional().or(z.literal('')),
    phone: z.string().max(50).optional().or(z.literal('')),
    serviceInterest: serviceInterestSchema.optional(),
    message: z.string().min(1, 'Message is required').max(5000),
    honeypot: z.string().max(200).optional().or(z.literal('')),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>
