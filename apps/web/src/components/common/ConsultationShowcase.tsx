import { ClipboardList, TrendingUp, Sparkles } from 'lucide-react'

const SURVEY_RESULTS = [
    { label: 'Very likely', value: 62, color: '#155f6b' },
    { label: 'Likely', value: 24, color: '#5A8A7A' },
    { label: 'Unsure', value: 14, color: '#D4956A' },
]

const FORECAST = [1.2, 1.6, 1.5, 2.1, 2.4, 2.3, 2.9]
const MAX = 3

function smoothPath(coords: { x: number; y: number }[]) {
    if (coords.length < 2) return ''
    let d = `M ${coords[0]!.x.toFixed(1)} ${coords[0]!.y.toFixed(1)}`
    for (let i = 0; i < coords.length - 1; i++) {
        const p1 = coords[i]!
        const p2 = coords[i + 1]!
        const p0 = coords[i - 1] ?? p1
        const p3 = coords[i + 2] ?? p2
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
}

function ConsultationShowcase() {
    const plot = { l: 8, r: 296, t: 10, b: 110 }
    const coords = FORECAST.map((v, i) => ({
        x: plot.l + (i / (FORECAST.length - 1)) * (plot.r - plot.l),
        y: plot.b - (v / MAX) * (plot.b - plot.t),
    }))
    const line = smoothPath(coords)

    return (
        <div className='relative mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0 lg:block lg:h-[520px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .consult-float-a { animation: consultFloatA 7s ease-in-out infinite; }
                    .consult-float-b { animation: consultFloatB 8.5s ease-in-out infinite; }
                    .consult-float-c { animation: consultFloatC 6.5s ease-in-out infinite; }
                }
                @keyframes consultFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
                @keyframes consultFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
                @keyframes consultFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-11px) } }
            `}</style>

            {/* Survey results card */}
            <div className='consult-float-a z-20 rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:left-0 lg:top-10 lg:w-[268px]'>
                <div className='mb-3 flex items-center gap-2.5'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary'>
                        <ClipboardList className='h-4 w-4' />
                    </div>
                    <p className='font-sans text-sm font-semibold text-foreground'>
                        Survey: purchase intent
                    </p>
                </div>
                <div className='flex flex-col gap-2.5'>
                    {SURVEY_RESULTS.map((r) => (
                        <div key={r.label} className='flex items-center gap-2'>
                            <span className='w-16 shrink-0 text-[11px] text-muted-foreground'>{r.label}</span>
                            <div className='h-2 flex-1 overflow-hidden rounded-full bg-border'>
                                <div
                                    className='h-full rounded-full'
                                    style={{ width: `${r.value}%`, backgroundColor: r.color }}
                                />
                            </div>
                            <span className='w-8 shrink-0 text-right font-mono text-[10px] font-medium text-foreground'>
                                {r.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Forecast trend card */}
            <div className='consult-float-c z-10 rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-[196px] lg:w-[336px]'>
                <div className='mb-3 flex items-center gap-3'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-primary'>
                        <TrendingUp className='h-4 w-4' />
                    </div>
                    <div>
                        <p className='font-sans text-sm font-semibold text-foreground'>Demand forecast</p>
                        <p className='text-xs text-muted-foreground'>
                            <span className='font-medium text-success'>+18%</span> next quarter
                        </p>
                    </div>
                </div>
                <svg viewBox='0 0 304 120' className='w-full' aria-hidden='true'>
                    <defs>
                        <linearGradient id='forecastFill' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='0' stopColor='#155f6b' stopOpacity='0.32' />
                            <stop offset='1' stopColor='#155f6b' stopOpacity='0' />
                        </linearGradient>
                    </defs>
                    <path
                        d={`${line} L ${coords[coords.length - 1]!.x.toFixed(1)} ${plot.b} L ${coords[0]!.x.toFixed(1)} ${plot.b} Z`}
                        fill='url(#forecastFill)'
                    />
                    <path d={line} fill='none' stroke='#155f6b' strokeWidth='2.75' strokeLinecap='round' strokeLinejoin='round' />
                    {coords.map((c, i) => (
                        <circle key={i} cx={c.x} cy={c.y} r={i === coords.length - 1 ? 4.5 : 2.5} fill='#155f6b' />
                    ))}
                </svg>
            </div>

            {/* Data quality badge */}
            <div className='consult-float-b z-30 flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:bottom-0 lg:left-6 lg:w-[240px]'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent'>
                    <Sparkles className='h-4 w-4' />
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='font-sans text-sm font-semibold text-foreground'>Data quality score</p>
                    <p className='text-xs text-muted-foreground'>98.4% · zero drift</p>
                </div>
            </div>
        </div>
    )
}

export default ConsultationShowcase
