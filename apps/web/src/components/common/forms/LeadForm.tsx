'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Textarea } from '@repo/ui/components/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select'
import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/react'
import { leadFormSchema, type LeadFormValues } from '@/lib/schemas/lead'

const SERVICE_OPTIONS = [
    { value: 'market_intelligence', label: 'Market Intelligence & Survey Research' },
    { value: 'custom_bi', label: 'Custom Business Intelligence (BI) Solutions' },
    { value: 'predictive_analytics', label: 'Predictive Analytics & Data Modeling' },
    { value: 'data_pipeline', label: 'Data Quality & Pipeline Engineering' },
    { value: 'other', label: 'Something else' },
] as const

const FIELD_BORDER = 'border-2 border-foreground/25'

type LeadFormProps = {
    variant: 'consultation' | 'contact'
    submitLabel?: string
    successMessage?: string
}

export function LeadForm({ variant, submitLabel, successMessage }: LeadFormProps) {
    const isConsultation = variant === 'consultation'

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LeadFormValues>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            name: '',
            email: '',
            company: '',
            phone: '',
            message: '',
            honeypot: '',
        },
    })

    const submit = trpc.leads.submit.useMutation()

    const onSubmit = (values: LeadFormValues) => {
        submit.mutate(
            {
                source: variant,
                name: values.name,
                email: values.email,
                company: values.company || undefined,
                phone: values.phone || undefined,
                serviceInterest: isConsultation ? values.serviceInterest : undefined,
                message: values.message,
                honeypot: values.honeypot || undefined,
            },
            { onSuccess: () => reset() },
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {submit.isSuccess && (
                <p className='rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary'>
                    {successMessage ?? 'Thanks — we’ll be in touch shortly.'}
                </p>
            )}

            {/* Honeypot — visually hidden via clip (not display:none) so simple bots that only skip display:none/visibility:hidden still fill it */}
            <div className='sr-only' aria-hidden='true'>
                <label htmlFor='lead-company-url'>Leave this field empty</label>
                <input
                    id='lead-company-url'
                    type='text'
                    tabIndex={-1}
                    autoComplete='off'
                    {...register('honeypot')}
                />
            </div>

            <div className='grid gap-5 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                    <label htmlFor='lead-name' className='block text-sm font-medium text-foreground'>
                        Name
                    </label>
                    <Input id='lead-name' placeholder='Jane Doe' className={FIELD_BORDER} {...register('name')} />
                    {errors.name && <p className='text-xs text-destructive'>{errors.name.message}</p>}
                </div>

                <div className='space-y-1.5'>
                    <label htmlFor='lead-email' className='block text-sm font-medium text-foreground'>
                        Email
                    </label>
                    <Input id='lead-email' type='email' placeholder='jane@company.com' className={FIELD_BORDER} {...register('email')} />
                    {errors.email && <p className='text-xs text-destructive'>{errors.email.message}</p>}
                </div>
            </div>

            {isConsultation && (
                <div className='grid gap-5 sm:grid-cols-2'>
                    <div className='space-y-1.5'>
                        <label htmlFor='lead-company' className='block text-sm font-medium text-foreground'>
                            Company <span className='font-normal text-muted-foreground'>(optional)</span>
                        </label>
                        <Input id='lead-company' placeholder='Company name' className={FIELD_BORDER} {...register('company')} />
                    </div>

                    <div className='space-y-1.5'>
                        <label htmlFor='lead-phone' className='block text-sm font-medium text-foreground'>
                            Phone <span className='font-normal text-muted-foreground'>(optional)</span>
                        </label>
                        <Input id='lead-phone' type='tel' placeholder='+254 7...' className={FIELD_BORDER} {...register('phone')} />
                    </div>
                </div>
            )}

            {isConsultation && (
                <div className='space-y-1.5'>
                    <label className='block text-sm font-medium text-foreground'>
                        Which service are you interested in?
                    </label>
                    <Controller
                        name='serviceInterest'
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={cn('w-full', FIELD_BORDER)}>
                                    <SelectValue placeholder='Select a service' />
                                </SelectTrigger>
                                <SelectContent>
                                    {SERVICE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            )}

            <div className='space-y-1.5'>
                <label htmlFor='lead-message' className='block text-sm font-medium text-foreground'>
                    {isConsultation ? 'Tell us about your project' : 'Message'}
                </label>
                <Textarea id='lead-message' rows={5} placeholder='What are you trying to achieve?' className={FIELD_BORDER} {...register('message')} />
                {errors.message && <p className='text-xs text-destructive'>{errors.message.message}</p>}
            </div>

            {submit.error && (
                <p className='rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive'>
                    Something went wrong. Please try again.
                </p>
            )}

            <Button type='submit' disabled={submit.isPending} className='w-full sm:w-auto'>
                {submit.isPending ? (
                    <>
                        <Loader2 size={14} className='animate-spin' />
                        Sending…
                    </>
                ) : (
                    submitLabel ?? (isConsultation ? 'Request a consultation' : 'Send message')
                )}
            </Button>
        </form>
    )
}
