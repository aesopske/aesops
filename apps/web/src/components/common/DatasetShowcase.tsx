import { Table2, Database, BarChart3, ArrowUpRight } from 'lucide-react'

const ROWS = [
    ['Agriculture', '2023', 'KSh 4.2B'],
    ['Energy', '2024', 'KSh 1.8B'],
    ['Transport', '2023', 'KSh 3.1B'],
    ['Health', '2024', 'KSh 2.7B'],
]

const TYPES = [
    { label: 'numeric', color: 'bg-[#2D6A73]' },
    { label: 'categorical', color: 'bg-[#7A9E8E]' },
    { label: 'boolean', color: 'bg-[#4CAF50]' },
    { label: 'datetime', color: 'bg-[#D4956A]' },
]

function DatasetShowcase() {
    return (
        <div className='relative mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0 lg:block lg:h-[520px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .ds-float-a { animation: dsFloatA 7s ease-in-out infinite; }
                    .ds-float-b { animation: dsFloatB 8.5s ease-in-out infinite; }
                    .ds-float-c { animation: dsFloatC 6.5s ease-in-out infinite; }
                }
                @keyframes dsFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
                @keyframes dsFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
                @keyframes dsFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
            `}</style>

            {/* Data table preview */}
            <div className='ds-float-a z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:left-0 lg:top-8 lg:w-[380px]'>
                <div className='flex items-center gap-2.5 border-b border-border px-4 py-3'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        <Table2 className='h-4 w-4' />
                    </div>
                    <div>
                        <p className='font-sans text-sm font-semibold text-foreground'>
                            Kenya Sector Data
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                            24 columns · 1,428 rows
                        </p>
                    </div>
                </div>

                <div className='overflow-x-auto px-0'>
                    <table className='w-full border-collapse text-[11px]'>
                        <thead>
                            <tr className='border-b border-border bg-muted/30'>
                                {['Sector', 'Year', 'Value'].map((h) => (
                                    <th
                                        key={h}
                                        className='px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground'>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map((row, i) => (
                                <tr
                                    key={i}
                                    className='border-b border-border/50 last:border-0'>
                                    {row.map((cell, j) => (
                                        <td
                                            key={j}
                                            className='px-4 py-2.5 font-sans text-foreground/80'>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='border-t border-border px-4 py-2.5'>
                    <div className='flex items-center gap-2'>
                        {TYPES.slice(0, 3).map((t) => (
                            <span
                                key={t.label}
                                className='inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[9px] text-white'
                                style={{ backgroundColor: t.color === 'bg-[#2D6A73]' ? '#2D6A73' : t.color === 'bg-[#7A9E8E]' ? '#7A9E8E' : '#4CAF50' }}>
                                <span className='h-1.5 w-1.5 rounded-full bg-white/40' />
                                {t.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats card — bottom anchor */}
            <div className='ds-float-b z-30 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:bottom-4 lg:left-0 lg:w-[240px]'>
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                    <Database className='h-4 w-4' />
                </div>
                <div>
                    <p className='font-sans text-sm font-semibold text-foreground'>
                        240+ datasets
                    </p>
                    <p className='text-[11px] text-muted-foreground'>
                        Across 12 sectors
                    </p>
                </div>
            </div>

            {/* Bar chart card — right side */}
            <div className='ds-float-c z-10 rounded-2xl border border-border bg-card p-5 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-16 lg:w-[280px]'>
                <div className='mb-4 flex items-center gap-2.5'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        <BarChart3 className='h-4 w-4' />
                    </div>
                    <span className='font-sans text-sm font-semibold text-foreground'>
                        Downloads
                    </span>
                    <span className='ml-auto flex items-center gap-0.5 text-[11px] font-medium text-success'>
                        +18% <ArrowUpRight className='h-3 w-3' />
                    </span>
                </div>

                <svg viewBox='0 0 240 120' className='w-full' aria-hidden='true'>
                    {[80, 60].map((left, i) => (
                        <g key={i}>
                            {[60, 45, 30, 15, 0].map((y) => (
                                <line
                                    key={y}
                                    x1={left - 4}
                                    y1={y}
                                    x2={left + 94}
                                    y2={y}
                                    stroke='rgba(120,130,130,0.1)'
                                    strokeWidth='1'
                                />
                            ))}
                            <text
                                x={left - 8}
                                y={5}
                                textAnchor='end'
                                fontSize='8'
                                fontFamily='monospace'
                                fill='rgba(92,107,110,0.6)'>
                                {i === 0 ? '60k' : ''}
                            </text>
                            <text
                                x={left - 8}
                                y={20}
                                textAnchor='end'
                                fontSize='8'
                                fontFamily='monospace'
                                fill='rgba(92,107,110,0.6)'>
                                {i === 0 ? '40k' : ''}
                            </text>
                            <text
                                x={left - 8}
                                y={35}
                                textAnchor='end'
                                fontSize='8'
                                fontFamily='monospace'
                                fill='rgba(92,107,110,0.6)'>
                                {i === 0 ? '20k' : ''}
                            </text>
                            <text
                                x={left - 8}
                                y={50}
                                textAnchor='end'
                                fontSize='8'
                                fontFamily='monospace'
                                fill='rgba(92,107,110,0.6)'>
                                {i === 0 ? '0' : ''}
                            </text>
                            {[
                                { h: 32, l: 'Jan' },
                                { h: 52, l: 'Feb' },
                                { h: 28, l: 'Mar' },
                                { h: 65, l: 'Apr' },
                                { h: 45, l: 'May' },
                                { h: 72, l: 'Jun' },
                            ].map((bar, j) => (
                                <g key={j}>
                                    <rect
                                        x={left + j * 15}
                                        y={55 - bar.h}
                                        width='9'
                                        height={bar.h}
                                        rx='3'
                                        fill={i === 0 ? '#2D6A73' : '#9BB3AC'}
                                        opacity={i === 0 ? 0.7 : 0.35}
                                    />
                                    <text
                                        x={left + j * 15 + 4.5}
                                        y={69}
                                        textAnchor='middle'
                                        fontSize='7'
                                        fontFamily='monospace'
                                        fill='rgba(92,107,110,0.6)'>
                                        {bar.l}
                                    </text>
                                </g>
                            ))}
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    )
}

export default DatasetShowcase
