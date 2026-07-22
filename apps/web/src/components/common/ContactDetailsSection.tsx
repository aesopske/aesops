import { Mail } from 'lucide-react'
import Animate from './atoms/Animate'
import { CONTACT_EMAILS, SOCIALS } from '@/lib/constants/socials'
import { ContactDetailsBlock } from '~sanity/utils/types'

type ContactDetailsSectionProps = {
    block: ContactDetailsBlock
}

function ContactDetailsSection({ block }: ContactDetailsSectionProps) {
    return (
        <section className='relative w-full bg-background py-16 lg:py-20'>
            <div className='relative z-10 mx-auto max-w-2xl px-6 lg:px-8 text-center'>
                <Animate dir='up'>
                    <h2 className='font-sans font-black text-2xl md:text-3xl tracking-tight leading-tight text-foreground'>
                        {block.heading ?? 'Other ways to reach us'}
                    </h2>
                    {block.description && (
                        <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
                            {block.description}
                        </p>
                    )}

                    <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
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

                    <div className='mt-6 flex items-center justify-center gap-4'>
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
                </Animate>
            </div>
        </section>
    )
}

export default ContactDetailsSection
