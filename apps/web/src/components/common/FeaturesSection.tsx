import { ArrowRight, BarChart2, BookOpen, Database, Download, FileText, Search, Shield, Sparkles, Table, Upload, Users, Zap } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import Animate from '@components/common/atoms/Animate'
import { cn } from '@/lib/utils'
import { FeaturesBlock } from '~sanity/utils/types'
import DataAccessibilityViz from './DataAccessibilityViz'
import type { LucideIcon } from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
    database: Database,
    search: Search,
    upload: Upload,
    chart: BarChart2,
    sparkles: Sparkles,
    users: Users,
    download: Download,
    table: Table,
    file: FileText,
    book: BookOpen,
    zap: Zap,
    shield: Shield,
}

type FeaturesSectionProps = {
    block: FeaturesBlock
}

function FeaturesSection({ block }: FeaturesSectionProps) {
    const isDark = block.variant === 'dark'
    const features = block.features ?? []

    return (
        <section
            className={cn(
                'relative w-full overflow-hidden py-16 lg:py-20',
                isDark ? 'bg-[#0A2533]' : 'bg-background',
            )}>
            {/* Dot-grid texture */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.05]'
                style={{
                    backgroundImage: isDark
                        ? 'radial-gradient(circle, white 1px, transparent 1px)'
                        : 'radial-gradient(circle, #155f6b 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            {/* Soft glow */}
            <div
                aria-hidden
                className={cn(
                    'pointer-events-none absolute -top-24 h-96 w-96 rounded-full blur-3xl',
                    isDark
                        ? 'right-0 bg-accent/10'
                        : 'left-1/4 bg-primary/[0.07]',
                )}
            />

            <div className='relative z-10 mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                {/* Section header */}
                <Animate dir='up' className='mb-12'>
                    <div className={cn(
                        'flex gap-10 lg:gap-16',
                        block.image ? 'flex-col lg:flex-row lg:items-center' : 'flex-col',
                    )}>
                        {/* Text */}
                        <div className={cn(
                            'flex items-center justify-between gap-6 flex-wrap',
                            block.image ? 'flex-1' : 'w-full',
                        )}>
                            <div className='space-y-2 max-w-xl'>
                                <div className='flex items-center gap-3'>
                                    <div
                                        className={cn(
                                            'w-5 h-px',
                                            isDark ? 'bg-accent' : 'bg-primary',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'text-[10px] font-mono font-medium tracking-[0.22em] uppercase',
                                            isDark ? 'text-accent' : 'text-primary',
                                        )}>
                                        {block.overline ?? 'Platform'}
                                    </span>
                                </div>
                                <h2
                                    className={cn(
                                        'font-sans font-black text-3xl md:text-4xl tracking-tight leading-tight',
                                        isDark ? 'text-white' : 'text-foreground',
                                    )}>
                                    {block.heading ?? 'Platform Features'}
                                </h2>
                                {block.description && (
                                    <p
                                        className={cn(
                                            'text-base leading-relaxed pt-1',
                                            isDark ? 'text-white/55' : 'text-muted-foreground',
                                        )}>
                                        {block.description}
                                    </p>
                                )}
                            </div>

                            {block.ctaLabel && block.ctaLink && (
                                <TransitionLink
                                    href={block.ctaLink}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 text-xs font-mono font-medium hover:gap-2.5 transition-all duration-200 pb-0.5 shrink-0',
                                        isDark
                                            ? 'text-accent/80 hover:text-accent'
                                            : 'text-primary/70 hover:text-primary',
                                    )}>
                                    {block.ctaLabel}
                                    <ArrowRight className='w-3.5 h-3.5' />
                                </TransitionLink>
                            )}
                        </div>

                        {/* Data-accessibility viz for the Problem block; falls back for other light blocks */}
                        {block.image && !isDark && (
                            <DataAccessibilityViz />
                        )}
                    </div>
                </Animate>

                {/* Feature grid */}
                <div
                    className={cn(
                        'grid gap-px',
                        isDark
                            ? 'rounded-2xl overflow-hidden bg-white/[0.06]'
                            : 'rounded-2xl overflow-hidden bg-border',
                        features.length <= 2
                            ? 'grid-cols-1 md:grid-cols-2'
                            : features.length === 3
                              ? 'grid-cols-1 md:grid-cols-3'
                              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                    )}>
                    {features.map((feature, idx) => {
                        const IconComponent = ICON_MAP[feature.icon ?? 'database'] ?? Database

                        const card = isDark ? (
                            /* ── Platform / dark card ── */
                            <div className='group relative flex flex-col gap-5 p-7 h-full overflow-hidden transition-all duration-300 bg-[#0A2533] hover:bg-[#0d2d3e]'>
                                {/* top highlight line — appears on hover */}
                                <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400' />

                                {/* Icon */}
                                <div className='w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.07] text-primary-foreground transition-all duration-300 group-hover:bg-accent/20 group-hover:text-accent'>
                                    <IconComponent className='w-5 h-5' />
                                </div>

                                <div className='flex flex-col gap-2 flex-1'>
                                    <h3 className='font-sans font-semibold text-base tracking-tight leading-snug text-white/90 transition-colors duration-200 group-hover:text-white'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-sm leading-relaxed flex-1 text-white/45 group-hover:text-white/60 transition-colors duration-200'>
                                        {feature.description}
                                    </p>
                                </div>

                                {feature.link && (
                                    <span className='inline-flex items-center gap-1.5 text-[11px] font-mono font-medium mt-auto text-accent/60 group-hover:text-accent transition-all duration-200 group-hover:gap-2.5'>
                                        {feature.linkLabel ?? 'Learn more'}
                                        <ArrowRight className='w-3 h-3' />
                                    </span>
                                )}
                            </div>
                        ) : (
                            /* ── Problem / light card — editorial stark ── */
                            <div className='group relative flex flex-col gap-5 p-7 h-full overflow-hidden bg-background transition-all duration-300'>
                                {/* muted index — top right */}
                                <span className='absolute right-6 top-5 font-mono text-4xl font-bold leading-none select-none text-foreground/[0.05] transition-colors duration-300 group-hover:text-primary/[0.12]'>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>

                                {/* Icon — small, no box */}
                                <div className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/8 text-primary transition-all duration-300 group-hover:bg-primary/14'>
                                    <IconComponent className='w-4 h-4' />
                                </div>

                                <div className='flex flex-col gap-2 flex-1'>
                                    <h3 className='font-sans font-semibold text-base tracking-tight leading-snug text-foreground transition-colors duration-200 group-hover:text-primary'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-sm leading-relaxed flex-1 text-muted-foreground'>
                                        {feature.description}
                                    </p>
                                </div>

                                {feature.link && (
                                    <span className='inline-flex items-center gap-1.5 text-[11px] font-mono font-medium mt-auto text-primary/60 group-hover:text-primary transition-all duration-200 group-hover:gap-2.5'>
                                        {feature.linkLabel ?? 'Learn more'}
                                        <ArrowRight className='w-3 h-3' />
                                    </span>
                                )}

                                {/* bottom accent line — scales in on hover */}
                                <div className='absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent' />
                            </div>
                        )

                        return (
                            <Animate
                                key={feature._key}
                                dir='up'
                                duration={0.45 + idx * 0.06}>
                                {feature.link ? (
                                    <TransitionLink href={feature.link} className='block h-full'>
                                        {card}
                                    </TransitionLink>
                                ) : (
                                    card
                                )}
                            </Animate>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
