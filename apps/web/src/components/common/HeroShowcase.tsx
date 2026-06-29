import { MessageSquare, TrendingUp, Users } from 'lucide-react'

const ACTIVITY = [0.8, 2.2, 3.0, 3.14, 2.0, 3.5, 3.9]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const MARKER = 3
const MAX = 4

const DATASETS = [
    { label: 'Kenya Population', color: '#155f6b' },
    { label: 'Fuel Prices', color: '#5A8A7A' },
    { label: 'Food Prices', color: '#D4956A' },
    { label: 'Trade Data', color: '#9BB3AC' },
]
// Equal segments, purely illustrative
const SEG = 100 / DATASETS.length
const R = 42
const CIRC = 2 * Math.PI * R

const COMMUNITY = [
    { initials: 'NK', color: '#155f6b' },
    { initials: 'AM', color: '#5A8A7A' },
    { initials: 'BW', color: '#D4956A' },
]

type Pt = { x: number; y: number }

function smoothPath(pts: Pt[]) {
    if (pts.length < 2) return ''
    let d = `M ${pts[0]!.x.toFixed(1)} ${pts[0]!.y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i]!
        const p2 = pts[i + 1]!
        const p0 = pts[i - 1] ?? p1
        const p3 = pts[i + 2] ?? p2
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
}

function HeroShowcase() {
    const plot = { l: 34, r: 350, t: 14, b: 150 }
    const coords = ACTIVITY.map((v, i) => ({
        x: plot.l + (i / (ACTIVITY.length - 1)) * (plot.r - plot.l),
        y: plot.b - (v / MAX) * (plot.b - plot.t),
    }))
    const line = smoothPath(coords)
    const area = `${line} L ${coords[coords.length - 1]!.x.toFixed(1)} ${plot.b} L ${coords[0]!.x.toFixed(1)} ${plot.b} Z`
    const yTicks = [4, 3, 2, 1, 0]
    const mark = coords[MARKER]!

    const arcs = DATASETS.map((c, i) => ({
        ...c,
        dash: (SEG / 100) * CIRC,
        rotate: -90 + (i * SEG / 100) * 360,
    }))

    return (
        <div className='relative mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0 lg:block lg:h-[520px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .hero-float-a { animation: heroFloatA 7s ease-in-out infinite; }
                    .hero-float-b { animation: heroFloatB 8.5s ease-in-out infinite; }
                    .hero-float-c { animation: heroFloatC 6.5s ease-in-out infinite; }
                    .hero-float-d { animation: heroFloatD 9s ease-in-out infinite; }
                }
                @keyframes heroFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
                @keyframes heroFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
                @keyframes heroFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
                @keyframes heroFloatD { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
            `}</style>

            {/* Top datasets donut */}
            <div className='hero-float-a z-20 rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:left-0 lg:top-16 lg:w-[248px]'>
                <p className='font-sans text-sm font-semibold text-foreground'>
                    Top datasets
                </p>

                <div className='relative mt-3 flex items-center justify-center'>
                    <svg viewBox='0 0 120 120' className='h-32 w-32' aria-hidden='true'>
                        <circle
                            cx='60'
                            cy='60'
                            r={R}
                            fill='none'
                            stroke='rgba(120,130,130,0.1)'
                            strokeWidth='13'
                        />
                        {arcs.map((a) => (
                            <circle
                                key={a.label}
                                cx='60'
                                cy='60'
                                r={R}
                                fill='none'
                                stroke={a.color}
                                strokeWidth='13'
                                strokeDasharray={`${(a.dash - 3).toFixed(1)} ${CIRC.toFixed(1)}`}
                                transform={`rotate(${a.rotate.toFixed(1)} 60 60)`}
                            />
                        ))}
                    </svg>
                </div>

                <div className='mt-3 flex flex-col gap-2'>
                    {DATASETS.map((c) => (
                        <div key={c.label} className='flex items-center gap-2'>
                            <span
                                className='h-2 w-2 shrink-0 rounded-full'
                                style={{ backgroundColor: c.color }}
                            />
                            <span className='truncate text-[11px] text-muted-foreground'>
                                {c.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community discussion card */}
            <div className='hero-float-d z-30 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-0 lg:w-[330px]'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <MessageSquare className='h-[18px] w-[18px]' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='truncate font-sans text-sm font-semibold text-foreground'>
                        Fuel Prices dataset
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                        12 people discussing this week
                    </p>
                </div>
                <div className='flex shrink-0 -space-x-2'>
                    {COMMUNITY.map((u) => (
                        <span
                            key={u.initials}
                            className='flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-card text-[9px] font-bold text-white'
                            style={{ backgroundColor: u.color }}>
                            {u.initials}
                        </span>
                    ))}
                </div>
            </div>

            {/* Activity chart */}
            <div className='hero-float-c z-10 rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-[148px] lg:w-[400px]'>
                <div className='mb-3 flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary'>
                        <TrendingUp className='h-4 w-4' />
                    </div>
                    <div>
                        <p className='font-sans text-sm font-semibold text-foreground'>
                            Dataset activity
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            <span className='font-medium text-success'>+12%</span>{' '}
                            this week
                        </p>
                    </div>
                </div>

                <svg viewBox='0 0 360 188' className='w-full' aria-hidden='true'>
                    <defs>
                        <linearGradient id='areaFill' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0' stopColor='#155f6b' stopOpacity='0.32' />
                            <stop offset='1' stopColor='#155f6b' stopOpacity='0' />
                        </linearGradient>
                    </defs>

                    {yTicks.map((k) => {
                        const y = plot.b - (k / MAX) * (plot.b - plot.t)
                        return (
                            <g key={k}>
                                <line
                                    x1={plot.l} y1={y} x2={plot.r} y2={y}
                                    stroke='rgba(120,130,130,0.16)'
                                    strokeWidth='1'
                                    strokeDasharray={k === 0 ? undefined : '3 4'}
                                />
                                <text
                                    x={plot.l - 8} y={y + 3.5}
                                    textAnchor='end' fontSize='9'
                                    fontFamily='monospace'
                                    fill='rgba(92,107,110,0.7)'>
                                    {k}k
                                </text>
                            </g>
                        )
                    })}

                    <path d={area} fill='url(#areaFill)' />
                    <path
                        d={line} fill='none' stroke='#155f6b'
                        strokeWidth='2.75' strokeLinecap='round' strokeLinejoin='round'
                    />

                    <line
                        x1={mark.x} y1={plot.t} x2={mark.x} y2={plot.b}
                        stroke='#155f6b' strokeWidth='1'
                        strokeDasharray='3 3' opacity='0.45'
                    />
                    <circle cx={mark.x} cy={mark.y} r='4.5' fill='#155f6b' stroke='#F8F3ED' strokeWidth='2' />
                    <g transform={`translate(${mark.x - 24}, ${mark.y - 30})`}>
                        <rect width='48' height='20' rx='5' fill='#0A2533' />
                        <text x='24' y='13.5' textAnchor='middle' fontSize='10'
                            fontFamily='monospace' fontWeight='600' fill='#F8F3ED'>
                            3,140
                        </text>
                    </g>

                    {coords.map((c, i) => (
                        <text key={i} x={c.x} y={172} textAnchor='middle'
                            fontSize='9' fontFamily='monospace'
                            fill='rgba(92,107,110,0.7)'>
                            {MONTHS[i]}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Community members count — bottom-left anchor */}
            <div className='hero-float-b z-20 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:bottom-0 lg:left-0 lg:w-[248px]'>
                <Users className='h-4 w-4 shrink-0 text-primary' />
                <span className='font-sans text-xs font-semibold text-foreground'>
                    Active community
                </span>
            </div>
        </div>
    )
}

export default HeroShowcase
