import { cn } from '@/lib/utils'
import Animate from './atoms/Animate'
import { PageHeroBlock } from '~sanity/utils/types'

const alignMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
} as const

const bgColors = {
    primary: 'var(--primary)',
    dark: '#0A2533',
    accent: '#D4956A',
    light: '#F8F3ED',
} as const

const textColors = {
    primary: 'var(--primary-foreground)',
    dark: '#F0EBE4',
    accent: '#0A2533',
    light: '#0A2533',
} as const

const dotColor = {
    primary: 'white',
    dark: 'white',
    accent: '#0A2533',
    light: '#0A2533',
} as const

interface PageHeroProps {
    block: PageHeroBlock
}

function PageHero({ block }: PageHeroProps) {
    const bg = (block.backgroundColor ?? 'primary') as keyof typeof bgColors
    const align = block.textAlign ?? 'center'
    const isLight = bg === 'light' || bg === 'accent'

    return (
        <section
            className='relative overflow-hidden flex items-center min-h-[38vh]'
            style={{ backgroundColor: bgColors[bg] }}>
            {/* Dot-grid texture */}
            <div
                className='absolute inset-0 opacity-[0.06]'
                style={{
                    backgroundImage: `radial-gradient(circle, ${dotColor[bg]} 1px, transparent 1px)`,
                    backgroundSize: '22px 22px',
                }}
            />

            {/* Diagonal scan lines */}
            <svg
                className='absolute inset-0 w-full h-full pointer-events-none'
                aria-hidden='true'>
                <line
                    x1='0' y1='80%' x2='60%' y2='0'
                    stroke={isLight ? 'rgba(10,37,51,0.04)' : 'rgba(248,243,237,0.03)'}
                    strokeWidth='1'
                />
                <line
                    x1='40%' y1='100%' x2='100%' y2='10%'
                    stroke={isLight ? 'rgba(10,37,51,0.04)' : 'rgba(248,243,237,0.03)'}
                    strokeWidth='1'
                />
            </svg>

            {/* Vignette */}
            <div
                className='absolute inset-0'
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.10), transparent, rgba(0,0,0,0.15))',
                }}
            />

            <div className='relative z-10 w-full px-6'>
                <Animate
                    dir='up'
                    className={cn(
                        'mx-auto max-w-2xl lg:max-w-4xl flex flex-col gap-5 py-16 lg:py-20',
                        alignMap[align],
                    )}>
                    {block.label && (
                        <span
                            className='w-fit inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-[0.16em] uppercase'
                            style={{
                                backgroundColor: isLight ? 'rgba(10,37,51,0.08)' : 'rgba(248,243,237,0.12)',
                                border: `1px solid ${isLight ? 'rgba(10,37,51,0.15)' : 'rgba(248,243,237,0.20)'}`,
                                color: isLight ? 'rgba(10,37,51,0.65)' : 'rgba(248,243,237,0.75)',
                            }}>
                            {block.label}
                        </span>
                    )}

                    <h1
                        className='font-sans font-light text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] max-w-3xl'
                        style={{ color: textColors[bg] }}>
                        {block.heading}
                    </h1>

                    {block.description && (
                        <p
                            className='font-sans text-base md:text-lg leading-relaxed max-w-xl'
                            style={{ color: textColors[bg], opacity: 0.65 }}>
                            {block.description}
                        </p>
                    )}
                </Animate>
            </div>
        </section>
    )
}

export default PageHero
