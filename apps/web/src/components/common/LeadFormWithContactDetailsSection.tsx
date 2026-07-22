import { Mail } from 'lucide-react'
import Animate from './atoms/Animate'
import { LeadForm } from './forms/LeadForm'
import { CONTACT_EMAILS, SOCIALS } from '@/lib/constants/socials'
import { ContactDetailsBlock, LeadFormBlock } from '~sanity/utils/types'

type LeadFormWithContactDetailsSectionProps = {
    leadFormBlock: LeadFormBlock
    contactDetailsBlock: ContactDetailsBlock
}

function LeadFormWithContactDetailsSection({ leadFormBlock, contactDetailsBlock }: LeadFormWithContactDetailsSectionProps) {
    return (
        <section id='lead-form' className='relative w-full bg-background py-16 lg:py-20'>
            <div className='relative z-10 mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                <div className='grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start'>
                    {/* Form */}
                    <Animate dir='up'>
                        <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight leading-tight text-foreground'>
                            {leadFormBlock.heading}
                        </h2>
                        {leadFormBlock.description && (
                            <p className='mt-3 mb-8 text-base leading-relaxed text-muted-foreground'>
                                {leadFormBlock.description}
                            </p>
                        )}
                        <LeadForm
                            variant={leadFormBlock.variant}
                            submitLabel={leadFormBlock.submitLabel}
                            successMessage={leadFormBlock.successMessage}
                        />
                    </Animate>

                    {/* Contact details */}
                    <Animate dir='up' duration={0.55}>
                        <div className='lg:pt-2'>
                            <h2 className='font-sans font-black text-2xl md:text-3xl tracking-tight leading-tight text-foreground'>
                                {contactDetailsBlock.heading ?? 'Other ways to reach us'}
                            </h2>
                            {contactDetailsBlock.description && (
                                <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
                                    {contactDetailsBlock.description}
                                </p>
                            )}

                            <div className='mt-8 flex flex-wrap gap-3'>
                                {CONTACT_EMAILS.map((c) => (
                                    <a
                                        key={c.email}
                                        href={`mailto:${c.email}`}
                                        className='inline-flex items-center gap-2 rounded-full border-2 border-foreground/25 px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary'>
                                        <Mail size={14} />
                                        <span className='font-medium'>{c.label}:</span>
                                        {c.email}
                                    </a>
                                ))}
                            </div>

                            <div className='mt-6 flex items-center gap-4'>
                                {SOCIALS.map(({ label, href, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        aria-label={label}
                                        className='text-muted-foreground transition hover:text-primary'>
                                        <Icon className='w-5 h-5' />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Animate>
                </div>
            </div>
        </section>
    )
}

export default LeadFormWithContactDetailsSection
