import Image from 'next/image'
import { ArrowRight, BarChart2, BookOpen, Database, Download, FileText, Search, Shield, Sparkles, Table, Upload, Users, Zap } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import Animate from '@components/common/atoms/Animate'
import { cn } from '@/lib/utils'
import { FeaturesBlock } from '~sanity/utils/types'
import { urlForImage } from '~sanity/utils/image'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
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

const ICON_COLORS = [
    'bg-primary/10 text-primary',
    'bg-accent/15 text-accent',
    'bg-[#5A8A7A]/15 text-[#5A8A7A]',
    'bg-primary/10 text-primary',
    'bg-accent/15 text-accent',
    'bg-[#5A8A7A]/15 text-[#5A8A7A]',
]

const ICON_COLORS_DARK = [
    'bg-white/10 text-primary-foreground',
    'bg-accent/20 text-accent',
    'bg-white/10 text-primary-foreground',
    'bg-accent/20 text-accent',
    'bg-white/10 text-primary-foreground',
    'bg-accent/20 text-accent',
]

type FeaturesSectionProps = {
    block: FeaturesBlock
}

function FeaturesSection({ block }: FeaturesSectionProps) {
    const isDark = block.variant === 'dark'
    const features = block.features ?? []

    return (
        <section
            className={cn(
                'w-full py-16 lg:py-20',
                isDark ? 'bg-[#0A2533]' : 'bg-background',
            )}>
            <div className='mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
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

                        {/* Optional image */}
                        {block.image && urlForImage(block.image) && (
                            <div className='w-full max-w-lg'>
                                <Image
                                    src={urlForImage(block.image)!}
                                    alt={block.heading ?? ''}
                                    width={600}
                                    height={500}
                                    className='w-full h-auto object-contain'
                                />
                            </div>
                        )}
                    </div>
                </Animate>

                {/* Feature grid */}
                <div
                    className={cn(
                        'grid gap-4',
                        features.length <= 2
                            ? 'grid-cols-1 md:grid-cols-2'
                            : features.length === 3
                              ? 'grid-cols-1 md:grid-cols-3'
                              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                    )}>
                    {features.map((feature, idx) => {
                        const IconComponent = ICON_MAP[feature.icon ?? 'database'] ?? Database
                        const colorClass = isDark
                            ? ICON_COLORS_DARK[idx % ICON_COLORS_DARK.length]
                            : ICON_COLORS[idx % ICON_COLORS.length]

                        const card = (
                            <div
                                className={cn(
                                    'group relative flex flex-col gap-4 p-6 rounded-xl border h-full overflow-hidden transition-all duration-300',
                                    isDark
                                        ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.14]'
                                        : 'bg-card border-border hover:border-primary/40 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]',
                                )}>
                                {/* Left accent on hover */}
                                <div
                                    className={cn(
                                        'absolute left-0 top-0 bottom-0 w-[2px] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r',
                                        isDark ? 'bg-accent' : 'bg-primary',
                                    )}
                                />

                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                                        colorClass,
                                    )}>
                                    <IconComponent className='w-5 h-5' />
                                </div>

                                <div className='flex flex-col gap-2 flex-1'>
                                    <h3
                                        className={cn(
                                            'font-sans font-semibold text-base tracking-tight leading-snug transition-colors duration-200',
                                            isDark
                                                ? 'text-white group-hover:text-accent'
                                                : 'text-foreground group-hover:text-primary',
                                        )}>
                                        {feature.title}
                                    </h3>
                                    <p
                                        className={cn(
                                            'text-sm leading-relaxed flex-1',
                                            isDark ? 'text-white/50' : 'text-muted-foreground',
                                        )}>
                                        {feature.description}
                                    </p>
                                </div>

                                {feature.link && (
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1.5 text-[11px] font-mono font-medium mt-auto transition-all duration-200 group-hover:gap-2',
                                            isDark ? 'text-accent/70' : 'text-primary/70',
                                        )}>
                                        {feature.linkLabel ?? 'Learn more'}
                                        <ArrowRight className='w-3 h-3' />
                                    </span>
                                )}
                            </div>
                        )

                        return (
                            <Animate
                                key={feature._key}
                                dir='up'
                                duration={0.45 + idx * 0.06}>
                                {feature.link ? (
                                    <TransitionLink
                                        href={feature.link}
                                        className='block h-full'>
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
