import { Inbox, MessageCircle, Clock } from 'lucide-react'

function ContactShowcase() {
    return (
        <div className='relative mx-auto flex w-full max-w-sm flex-col gap-3 lg:mx-0 lg:block lg:h-[300px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .contact-float-a { animation: contactFloatA 7s ease-in-out infinite; }
                    .contact-float-b { animation: contactFloatB 8s ease-in-out infinite; }
                    .contact-float-c { animation: contactFloatC 6.5s ease-in-out infinite; }
                }
                @keyframes contactFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
                @keyframes contactFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
                @keyframes contactFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
            `}</style>

            {/* New message card */}
            <div className='contact-float-a z-20 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[0_18px_45px_-22px_rgba(10,37,51,0.32)] lg:absolute lg:left-0 lg:top-2 lg:w-[260px]'>
                <div className='relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary'>
                    <Inbox className='h-4 w-4' />
                    <span className='absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='truncate font-sans text-sm font-semibold text-foreground'>New message</p>
                    <p className='truncate text-xs text-muted-foreground'>From the contact form</p>
                </div>
            </div>

            {/* Quick reply card */}
            <div className='contact-float-b z-30 rounded-2xl border border-border bg-card p-4 shadow-[0_18px_45px_-22px_rgba(10,37,51,0.32)] lg:absolute lg:right-0 lg:top-[108px] lg:w-[280px]'>
                <div className='mb-2 flex items-center gap-2'>
                    <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                        <MessageCircle className='h-3.5 w-3.5' />
                    </div>
                    <span className='font-sans text-xs font-semibold text-foreground'>Aesops team</span>
                </div>
                <p className='text-xs leading-relaxed text-foreground/80'>
                    Thanks for reaching out — we&rsquo;ll get back to you shortly!
                </p>
            </div>

            {/* Response time badge */}
            <div className='contact-float-c z-10 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_18px_45px_-22px_rgba(10,37,51,0.32)] lg:absolute lg:bottom-0 lg:left-10 lg:w-[224px]'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent'>
                    <Clock className='h-4 w-4' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='font-sans text-sm font-semibold text-foreground'>~1 business day</p>
                    <p className='text-xs text-muted-foreground'>Average response time</p>
                </div>
            </div>
        </div>
    )
}

export default ContactShowcase
