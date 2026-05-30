import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeroBlock } from '~sanity/utils/types'
import Animate from './atoms/Animate'

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
    block?: HeroBlock
}

function DataVisualization() {
    // Kenya counties / cities — inner ring, prominent
    const innerNodes = [
        { cx: 500, cy: 190, r: 20, label: 'Nairobi', float: '5s', delay: '0s' },
        {
            cx: 880,
            cy: 210,
            r: 18,
            label: 'Mombasa',
            float: '4.5s',
            delay: '0.6s',
        },
        {
            cx: 340,
            cy: 340,
            r: 17,
            label: 'Kisumu',
            float: '5.5s',
            delay: '0.3s',
        },
        { cx: 950, cy: 410, r: 16, label: 'Nakuru', float: '4s', delay: '1s' },
        {
            cx: 530,
            cy: 510,
            r: 16,
            label: 'Eldoret',
            float: '6s',
            delay: '0.8s',
        },
        { cx: 820, cy: 490, r: 14, label: 'Thika', float: '5s', delay: '1.2s' },
    ]

    // Neighbouring countries — outer ring, small and muted
    const outerNodes = [
        { cx: 100, cy: 200, label: 'Uganda' },
        { cx: 1280, cy: 160, label: 'Ethiopia' },
        { cx: 130, cy: 520, label: 'Tanzania' },
        { cx: 1320, cy: 460, label: 'Somalia' },
        { cx: 680, cy: 620, label: 'Rwanda' },
    ]

    const badges = [
        { x: 612, y: 205, w: 70, label: 'county', accent: false },
        { x: 755, y: 258, w: 70, label: 'gdp_usd', accent: true },
        { x: 758, y: 430, w: 46, label: 'year', accent: false },
        { x: 592, y: 430, w: 74, label: 'growth_%', accent: true },
        { x: 360, y: 490, w: 82, label: 'population', accent: false },
        { x: 980, y: 290, w: 74, label: 'trade_usd', accent: false },
    ]

    return (
        <svg
            viewBox='0 0 1400 700'
            preserveAspectRatio='xMidYMid slice'
            className='absolute inset-0 w-full h-full'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'>
            <defs>
                <pattern
                    id='hero-grid'
                    x='0'
                    y='0'
                    width='70'
                    height='70'
                    patternUnits='userSpaceOnUse'>
                    <circle
                        cx='35'
                        cy='35'
                        r='1.5'
                        fill='rgba(248,243,237,0.07)'
                    />
                </pattern>
                <style>{`
                    @keyframes heroNodeFloat {
                        0%,100% { transform: translateY(0); }
                        50%      { transform: translateY(-10px); }
                    }
                    @keyframes heroCardFloat {
                        0%,100% { transform: translateY(0); }
                        50%      { transform: translateY(-7px); }
                    }
                    @keyframes heroDashFlow {
                        to { stroke-dashoffset: -120; }
                    }
                `}</style>
            </defs>

            <rect width='1400' height='700' fill='url(#hero-grid)' />

            {/* Faint scan lines */}
            <line
                x1='0'
                y1='600'
                x2='600'
                y2='0'
                stroke='rgba(248,243,237,0.025)'
                strokeWidth='1'
            />
            <line
                x1='500'
                y1='700'
                x2='1200'
                y2='0'
                stroke='rgba(248,243,237,0.025)'
                strokeWidth='1'
            />
            <line
                x1='900'
                y1='700'
                x2='1400'
                y2='100'
                stroke='rgba(248,243,237,0.025)'
                strokeWidth='1'
            />

            {/* Hub → outer countries (very faint, long reach) */}
            {outerNodes.map((n, i) => (
                <line
                    key={i}
                    x1='700'
                    y1='350'
                    x2={n.cx}
                    y2={n.cy}
                    stroke='rgba(248,243,237,0.05)'
                    strokeWidth='1'
                />
            ))}

            {/* Hub → inner Kenya cities (solid, animated) */}
            {innerNodes.map((n, i) => (
                <line
                    key={i}
                    x1='700'
                    y1='350'
                    x2={n.cx}
                    y2={n.cy}
                    stroke='rgba(248,243,237,0.18)'
                    strokeWidth='1.5'
                    strokeDasharray='7 5'
                    style={{
                        animation: `heroDashFlow ${5 + i * 0.7}s linear infinite${i % 2 ? ' reverse' : ''}`,
                    }}
                />
            ))}

            {/* City-to-city connections within Kenya */}
            <line
                x1='500'
                y1='190'
                x2='340'
                y2='340'
                stroke='rgba(248,243,237,0.1)'
                strokeWidth='1'
            />
            <line
                x1='500'
                y1='190'
                x2='880'
                y2='210'
                stroke='rgba(248,243,237,0.09)'
                strokeWidth='1'
            />
            <line
                x1='880'
                y1='210'
                x2='950'
                y2='410'
                stroke='rgba(248,243,237,0.09)'
                strokeWidth='1'
            />
            <line
                x1='340'
                y1='340'
                x2='530'
                y2='510'
                stroke='rgba(248,243,237,0.09)'
                strokeWidth='1'
            />
            <line
                x1='530'
                y1='510'
                x2='820'
                y2='490'
                stroke='rgba(248,243,237,0.09)'
                strokeWidth='1'
            />
            <line
                x1='820'
                y1='490'
                x2='950'
                y2='410'
                stroke='rgba(248,243,237,0.09)'
                strokeWidth='1'
            />

            {/* Data stream arc across the canvas */}
            <path
                d='M 0 480 C 300 380, 500 180, 700 350 S 1000 520, 1400 220'
                fill='none'
                stroke='rgba(212,149,106,0.2)'
                strokeWidth='2'
                strokeDasharray='10 6'
                style={{ animation: 'heroDashFlow 12s linear infinite' }}
            />

            {/* ── Kenya hub ── */}
            {/* Outer pulse ring 1 */}
            <circle
                cx='700'
                cy='350'
                r='38'
                fill='none'
                stroke='rgba(212,149,106,0.45)'
                strokeWidth='1.5'>
                <animate
                    attributeName='r'
                    values='38;85'
                    dur='2.8s'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='opacity'
                    values='0.55;0'
                    dur='2.8s'
                    repeatCount='indefinite'
                />
            </circle>
            {/* Outer pulse ring 2 */}
            <circle
                cx='700'
                cy='350'
                r='38'
                fill='none'
                stroke='rgba(212,149,106,0.22)'
                strokeWidth='1'>
                <animate
                    attributeName='r'
                    values='38;120'
                    dur='2.8s'
                    begin='1.1s'
                    repeatCount='indefinite'
                />
                <animate
                    attributeName='opacity'
                    values='0.35;0'
                    dur='2.8s'
                    begin='1.1s'
                    repeatCount='indefinite'
                />
            </circle>
            {/* Hub body */}
            <circle
                cx='700'
                cy='350'
                r='38'
                fill='rgba(212,149,106,0.14)'
                stroke='rgba(212,149,106,0.6)'
                strokeWidth='2.5'
            />
            <circle cx='700' cy='350' r='12' fill='rgba(212,149,106,0.95)' />
            <text
                x='700'
                y='404'
                textAnchor='middle'
                fill='rgba(248,243,237,0.75)'
                fontSize='13'
                fontFamily='monospace'
                fontWeight='600'>
                Kenya
            </text>
            <text
                x='700'
                y='420'
                textAnchor='middle'
                fill='rgba(248,243,237,0.4)'
                fontSize='10'
                fontFamily='monospace'>
                focus market
            </text>

            {/* ── Inner ring — Kenya cities ── */}
            {innerNodes.map((n, i) => (
                <g
                    key={i}
                    style={{
                        animation: `heroNodeFloat ${n.float} ease-in-out infinite ${n.delay}`,
                    }}>
                    <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={n.r}
                        fill='rgba(248,243,237,0.07)'
                        stroke='rgba(248,243,237,0.32)'
                        strokeWidth='1.5'
                    />
                    <circle
                        cx={n.cx}
                        cy={n.cy}
                        r={Math.round(n.r * 0.33)}
                        fill='rgba(248,243,237,0.7)'
                    />
                    <text
                        x={n.cx}
                        y={n.cy + n.r + 16}
                        textAnchor='middle'
                        fill='rgba(248,243,237,0.58)'
                        fontSize='11'
                        fontFamily='monospace'>
                        {n.label}
                    </text>
                </g>
            ))}

            {/* ── Outer ring — neighbouring countries (small, muted) ── */}
            {outerNodes.map((n, i) => (
                <g key={i}>
                    <circle
                        cx={n.cx}
                        cy={n.cy}
                        r='10'
                        fill='rgba(248,243,237,0.04)'
                        stroke='rgba(248,243,237,0.14)'
                        strokeWidth='1'
                    />
                    <circle
                        cx={n.cx}
                        cy={n.cy}
                        r='3.5'
                        fill='rgba(248,243,237,0.35)'
                    />
                    <text
                        x={n.cx}
                        y={n.cy + 22}
                        textAnchor='middle'
                        fill='rgba(248,243,237,0.28)'
                        fontSize='9'
                        fontFamily='monospace'>
                        {n.label}
                    </text>
                </g>
            ))}

            {/* Column badges */}
            {badges.map((b, i) => (
                <g key={i}>
                    <rect
                        x={b.x}
                        y={b.y}
                        width={b.w}
                        height={20}
                        rx={4}
                        fill={
                            b.accent
                                ? 'rgba(212,149,106,0.13)'
                                : 'rgba(248,243,237,0.06)'
                        }
                        stroke={
                            b.accent
                                ? 'rgba(212,149,106,0.26)'
                                : 'rgba(248,243,237,0.15)'
                        }
                        strokeWidth={1}
                    />
                    <text
                        x={b.x + b.w / 2}
                        y={b.y + 14}
                        textAnchor='middle'
                        fill={
                            b.accent
                                ? 'rgba(212,149,106,0.82)'
                                : 'rgba(248,243,237,0.5)'
                        }
                        fontSize={9}
                        fontFamily='monospace'>
                        {b.label}
                    </text>
                </g>
            ))}

            {/* Floating data cards */}
            <g style={{ animation: 'heroCardFloat 7s ease-in-out infinite' }}>
                <rect
                    x='28'
                    y='100'
                    width='138'
                    height='58'
                    rx='8'
                    fill='rgba(248,243,237,0.07)'
                    stroke='rgba(248,243,237,0.13)'
                    strokeWidth='1'
                />
                <text
                    x='44'
                    y='125'
                    fill='rgba(248,243,237,0.36)'
                    fontSize='9'
                    fontFamily='monospace'
                    letterSpacing='1'>
                    DATASETS
                </text>
                <text
                    x='44'
                    y='147'
                    fill='rgba(248,243,237,0.88)'
                    fontSize='20'
                    fontWeight='700'
                    fontFamily='monospace'>
                    1,284
                </text>
            </g>

            <g
                style={{
                    animation: 'heroCardFloat 8s ease-in-out infinite 1.5s',
                }}>
                <rect
                    x='1234'
                    y='470'
                    width='148'
                    height='58'
                    rx='8'
                    fill='rgba(248,243,237,0.07)'
                    stroke='rgba(248,243,237,0.13)'
                    strokeWidth='1'
                />
                <text
                    x='1250'
                    y='495'
                    fill='rgba(248,243,237,0.36)'
                    fontSize='9'
                    fontFamily='monospace'
                    letterSpacing='1'>
                    COUNTIES
                </text>
                <text
                    x='1250'
                    y='517'
                    fill='rgba(248,243,237,0.88)'
                    fontSize='20'
                    fontWeight='700'
                    fontFamily='monospace'>
                    47
                </text>
            </g>

            <g
                style={{
                    animation: 'heroCardFloat 6s ease-in-out infinite 0.7s',
                }}>
                <rect
                    x='1090'
                    y='58'
                    width='130'
                    height='40'
                    rx='8'
                    fill='rgba(248,243,237,0.07)'
                    stroke='rgba(248,243,237,0.13)'
                    strokeWidth='1'
                />
                <circle cx='1107' cy='78' r='4' fill='rgba(212,149,106,0.9)'>
                    <animate
                        attributeName='opacity'
                        values='1;0.3;1'
                        dur='1.5s'
                        repeatCount='indefinite'
                    />
                </circle>
                <text
                    x='1118'
                    y='82'
                    fill='rgba(248,243,237,0.78)'
                    fontSize='11'
                    fontFamily='monospace'>
                    Live data
                </text>
            </g>
        </svg>
    )
}

function Hero({ className, block }: HeroProps) {
    return (
        <section
            id='hero'
            className={cn(
                'bg-primary relative min-h-[60vh] overflow-hidden flex items-center',
                className,
            )}>
            <DataVisualization />

            {/* Readability overlay — softens the visualization behind the text */}
            <div className='absolute inset-0 bg-primary/55' />

            <div className='relative z-10 w-full px-6'>
                <Animate
                    dir='up'
                    className='mx-auto max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) flex flex-col items-center text-center gap-6 py-16'>
                    <div className='flex items-center gap-3'>
                        <span className='h-px w-10 bg-accent' />
                        <span className='text-primary-foreground/60 text-xs font-sans font-medium tracking-widest uppercase'>
                            Launching in Kenya
                        </span>
                        <span className='h-px w-10 bg-accent' />
                    </div>

                    <h1 className='font-sans font-bold tracking-tight text-primary-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-4xl'>
                        {block?.title ??
                            "Unveiling insights from Africa's data"}
                    </h1>

                    <div className='flex items-center justify-center gap-3 flex-wrap'>
                        {[
                            'Kenya-focused',
                            'AI-powered',
                            'Community-driven',
                        ].map((label) => (
                            <div
                                key={label}
                                className='bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5'>
                                <span className='text-primary-foreground/80 font-sans text-xs font-medium'>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {block?.cta && block.cta.length > 0 && (
                        <div className='flex flex-col sm:flex-row gap-3'>
                            {block.cta.map((item) => {
                                const isPrimary = item.variant === 'default' || item.variant === 'primary'
                                return (
                                    <Link
                                        key={item._key}
                                        href={item.link}
                                        target={item.isExternal ? '_blank' : undefined}
                                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                                        className={`inline-flex items-center justify-center gap-2 font-sans text-sm px-6 py-3 rounded-md transition-colors ${
                                            isPrimary
                                                ? 'bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90'
                                                : 'border border-primary-foreground/40 text-primary-foreground font-medium hover:bg-primary-foreground/10'
                                        }`}>
                                        {item.label}
                                        <ArrowRight className='w-4 h-4' />
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </Animate>
            </div>
        </section>
    )
}

export default Hero
