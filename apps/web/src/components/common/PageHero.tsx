import { cn } from '@/lib/utils'
import Animate from './atoms/Animate'
import { PageHeroBlock } from '~sanity/utils/types'

const bgMap = {
    primary: 'bg-primary',
    dark: 'bg-[#0A2533]',
    accent: 'bg-[#D4956A]',
    light: 'bg-[#F8F3ED]',
} as const

const textMap = {
    primary: 'text-primary-foreground',
    dark: 'text-[#F0EBE4]',
    accent: 'text-[#0A2533]',
    light: 'text-[#0A2533]',
} as const

const mutedMap = {
    primary: 'text-primary-foreground/60',
    dark: 'text-[#F0EBE4]/55',
    accent: 'text-[#0A2533]/60',
    light: 'text-[#0A2533]/55',
} as const

const labelMap = {
    primary:
        'bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground/70',
    dark: 'bg-white/8 border-white/15 text-[#F0EBE4]/65',
    accent: 'bg-black/10 border-black/15 text-[#0A2533]/65',
    light: 'bg-black/8 border-black/12 text-[#0A2533]/60',
} as const

const alignMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
} as const

interface PageHeroProps {
    block: PageHeroBlock
}

function PageHero({ block }: PageHeroProps) {
    const bg = block.backgroundColor ?? 'primary'
    const align = block.textAlign ?? 'center'
    const isLight = bg === 'light' || bg === 'accent'

    return (
        <section
            className={cn(
                'relative min-h-[38vh] overflow-hidden flex items-center',
                bgMap[bg],
            )}>
            {/* Dot-grid texture */}
            <div
                className='absolute inset-0 opacity-[0.06]'
                style={{
                    backgroundImage: isLight
                        ? 'radial-gradient(circle, #0A2533 1px, transparent 1px)'
                        : 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />

            {/* Diagonal scan lines */}
            <svg
                className='absolute inset-0 w-full h-full pointer-events-none'
                aria-hidden='true'>
                <line
                    x1='0'
                    y1='80%'
                    x2='60%'
                    y2='0'
                    stroke={
                        isLight
                            ? 'rgba(10,37,51,0.04)'
                            : 'rgba(248,243,237,0.03)'
                    }
                    strokeWidth='1'
                />
                <line
                    x1='40%'
                    y1='100%'
                    x2='100%'
                    y2='10%'
                    stroke={
                        isLight
                            ? 'rgba(10,37,51,0.04)'
                            : 'rgba(248,243,237,0.03)'
                    }
                    strokeWidth='1'
                />
            </svg>

            {/* Vignette — softens edges */}
            <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15' />

            <div className='relative z-10 w-full px-6'>
                <Animate
                    dir='up'
                    className={cn(
                        'mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) flex flex-col gap-5 py-16 lg:py-20',
                        alignMap[align],
                    )}>
                    {block.label && (
                        <span
                            className={cn(
                                'inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-mono font-medium tracking-[0.16em] uppercase',
                                labelMap[bg],
                            )}>
                            {block.label}
                        </span>
                    )}

                    <h1
                        className={cn(
                            'font-sans font-light text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] max-w-3xl',
                            textMap[bg],
                        )}>
                        {block.heading}
                    </h1>

                    {block.description && (
                        <p
                            className={cn(
                                'font-sans text-base md:text-lg leading-relaxed max-w-xl',
                                mutedMap[bg],
                            )}>
                            {block.description}
                        </p>
                    )}
                </Animate>
            </div>
        </section>
    )
}

export default PageHero
