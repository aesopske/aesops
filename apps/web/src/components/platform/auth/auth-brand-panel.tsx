import { Upload, BarChart3, Lock, type LucideIcon } from 'lucide-react'

const features = [
    { icon: Upload, text: 'Upload CSV and Excel datasets in seconds' },
    { icon: BarChart3, text: 'AI-generated insights and column-level stats' },
    { icon: Lock, text: 'Control access and licensing per dataset' },
]

type Feature = { icon: LucideIcon; text: string }

type Props = {
    /** Defaults to the marketing pitch shown on sign-in. Onboarding steps pass
     * their own copy to explain what that step is for. */
    badge?: string
    title?: React.ReactNode
    description?: string
    features?: Feature[]
}

export function AuthBrandPanel({
    badge = 'Launching in Kenya',
    title = <>Africa&rsquo;s open data platform</>,
    description = 'Upload, explore, and share datasets with a community building on Kenya’s data ecosystem.',
    features: items = features,
}: Props = {}) {
    return (
        <div className='relative hidden lg:flex flex-1 flex-col overflow-hidden bg-primary'>
            {/* dot-grid texture */}
            <div
                className='absolute inset-0 opacity-[0.06]'
                style={{
                    backgroundImage:
                        'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />

            {/* diagonal scan lines */}
            <svg
                className='absolute inset-0 w-full h-full pointer-events-none'
                aria-hidden='true'>
                <line
                    x1='0'
                    y1='80%'
                    x2='60%'
                    y2='0'
                    stroke='rgba(248,243,237,0.03)'
                    strokeWidth='1'
                />
                <line
                    x1='40%'
                    y1='100%'
                    x2='100%'
                    y2='10%'
                    stroke='rgba(248,243,237,0.03)'
                    strokeWidth='1'
                />
            </svg>

            {/* vignette */}
            <div className='absolute inset-0 bg-linear-to-br from-black/15 via-transparent to-black/20' />

            {/* content */}
            <div className='relative z-10 flex flex-1 flex-col justify-between px-12 py-14 xl:px-16'>
                <div className='my-auto py-12'>
                    <span className='inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground/70'>
                        {badge}
                    </span>

                    <h2 className='mt-5 font-sans font-light text-4xl xl:text-5xl leading-[1.1] tracking-tight text-primary-foreground max-w-sm'>
                        {title}
                    </h2>

                    <p className='mt-4 text-base leading-relaxed text-primary-foreground/55 max-w-xs'>
                        {description}
                    </p>

                    <ul className='mt-10 space-y-4'>
                        {items.map(({ icon: Icon, text }) => (
                            <li
                                key={text}
                                className='flex items-center gap-3.5'>
                                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/12 text-primary-foreground/80'>
                                    <Icon size={14} />
                                </div>
                                <span className='text-sm text-primary-foreground/75'>
                                    {text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className='font-mono text-[11px] text-primary-foreground/35 tracking-wide'>
                    aesops.co.ke
                </p>
            </div>
        </div>
    )
}
