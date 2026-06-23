import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HeroBlock } from '~sanity/utils/types'
import Animate from './atoms/Animate'
import HeroShowcase from './HeroShowcase'

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
    block?: HeroBlock
}

const FALLBACK_CTA = [
    { _key: 'a', label: 'Get started', link: '/datasets', variant: 'primary' },
    { _key: 'b', label: 'Browse datasets', link: '/datasets', variant: 'secondary' },
]

const ACTIONS = ['Contribute', 'Discuss', 'Download']

function Hero({ className, block }: HeroProps) {
    const cta = block?.cta && block.cta.length > 0 ? block.cta : FALLBACK_CTA

    return (
        <section
            id='hero'
            className={cn(
                'relative overflow-hidden bg-primary',
                className,
            )}>
            {/* dot-grid texture — white dots on teal, matching footer/platform sections */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.07]'
                style={{
                    backgroundImage:
                        'radial-gradient(circle, white 1.4px, transparent 1.4px)',
                    backgroundSize: '22px 22px',
                    maskImage:
                        'radial-gradient(125% 110% at 50% 0%, black 50%, transparent 100%)',
                    WebkitMaskImage:
                        'radial-gradient(125% 110% at 50% 0%, black 50%, transparent 100%)',
                }}
            />
            {/* soft glows */}
            <div
                aria-hidden
                className='pointer-events-none absolute -left-20 -top-24 h-[26rem] w-[26rem] rounded-full bg-primary-foreground/10 blur-3xl'
            />
            <div
                aria-hidden
                className='pointer-events-none absolute right-0 top-8 h-96 w-96 rounded-full bg-accent/15 blur-3xl'
            />
            <div
                aria-hidden
                className='pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-primary-foreground/8 blur-3xl'
            />
            {/* illustration glow — brightens the card cluster on the right */}
            <div
                aria-hidden
                className='pointer-events-none absolute right-[5%] top-1/2 h-[420px] w-[520px] -translate-y-1/2 rounded-full bg-primary-foreground/[0.13] blur-3xl'
            />
            {/* vignette — matches datasets/community hero depth */}
            <div aria-hidden className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15' />

            <div className='relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:py-24'>
                <div className='grid items-center gap-14 lg:grid-cols-2 lg:gap-10'>
                    <Animate
                        dir='up'
                        className='flex flex-col items-center text-center gap-6 lg:items-start lg:text-left'>
                        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1'>
                            <span className='relative flex h-2 w-2'>
                                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70' />
                                <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
                            </span>
                            <span className='font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground/70'>
                                Built for African data
                            </span>
                        </span>

                        <h1 className='font-sans text-4xl font-bold leading-[1.04] tracking-[-0.02em] text-primary-foreground sm:text-5xl lg:text-6xl xl:text-[4.25rem]'>
                            {block?.title ?? 'Make sense of Africa, one dataset at a time.'}
                        </h1>

                        <p className='max-w-md text-base leading-relaxed text-primary-foreground/65 lg:text-lg'>
                            {block?.description ??
                                'Explore, analyze, and share trustworthy datasets on Kenya and the continent — with AI-powered insights built in.'}
                        </p>

                        <div className='flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start'>
                            {cta.map((item) => {
                                const isPrimary =
                                    item.variant === 'default' ||
                                    item.variant === 'primary'
                                return (
                                    <Link
                                        key={item._key}
                                        href={item.link}
                                        target={
                                            'isExternal' in item &&
                                            item.isExternal
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel={
                                            'isExternal' in item &&
                                            item.isExternal
                                                ? 'noopener noreferrer'
                                                : undefined
                                        }
                                        className={cn(
                                            'inline-flex w-full items-center justify-center rounded-xl px-6 py-3 font-sans text-sm font-semibold transition-colors sm:w-auto',
                                            isPrimary
                                                ? 'bg-primary-foreground text-primary shadow-sm hover:bg-primary-foreground/90'
                                                : 'border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20',
                                        )}>
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>

                        <div className='flex items-center justify-center gap-2 flex-wrap lg:justify-start'>
                            {ACTIONS.map((label) => (
                                <span
                                    key={label}
                                    className='inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/60'>
                                    {label}
                                </span>
                            ))}
                        </div>
                    </Animate>

                    <HeroShowcase />
                </div>
            </div>
        </section>
    )
}

export default Hero
