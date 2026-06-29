// Visualises the data-fragmentation problem: many disconnected Kenyan data
// sources (government portals, PDFs, Excel dumps) with no unified access layer.

// Card half-dimensions — all geometry is relative to the card centre point
const CW = 92  // card width
const CH = 74  // card height
const HW = CW / 2
const HH = CH / 2

const SOURCES = [
    { x: 100,  y: 90,  label: 'Govt Portal', sub: 'go.ke', icon: 'globe', broken: true,  float: 0 },
    { x: 360,  y: 55,  label: 'Census PDF',  sub: '2019',  icon: 'file',  broken: true,  float: 1 },
    { x: 620,  y: 90,  label: 'Excel Dump',  sub: '.xlsx', icon: 'table', broken: false, float: 2 },
    { x: 100,  y: 310, label: 'Survey Data', sub: 'KNBS',  icon: 'chart', broken: true,  float: 3 },
    { x: 620,  y: 305, label: 'News Report', sub: 'PDF',   icon: 'file',  broken: true,  float: 4 },
    { x: 360,  y: 360, label: 'Trade Stats', sub: 'KRA',   icon: 'globe', broken: false, float: 5 },
]

const R = { x: 360, y: 210 }  // researcher centre

const FLOATS = [
    { dur: '7s',   dy: -10, delay: '0s'    },
    { dur: '8s',   dy: -13, delay: '0.7s'  },
    { dur: '6.5s', dy: -9,  delay: '0.3s'  },
    { dur: '9s',   dy: -12, delay: '1.1s'  },
    { dur: '7.5s', dy: -11, delay: '0.5s'  },
    { dur: '8.5s', dy: -8,  delay: '1.6s'  },
]

function SourceIcon({ type }: { type: string }) {
    if (type === 'globe') return (
        <g>
            <circle cx='12' cy='12' r='8.5' fill='none' stroke='currentColor' strokeWidth='1.6' />
            <ellipse cx='12' cy='12' rx='3.5' ry='8.5' fill='none' stroke='currentColor' strokeWidth='1.6' />
            <line x1='3.5' y1='12' x2='20.5' y2='12' stroke='currentColor' strokeWidth='1.6' />
        </g>
    )
    if (type === 'table') return (
        <g>
            <rect x='3' y='5' width='18' height='14' rx='2' fill='none' stroke='currentColor' strokeWidth='1.6' />
            <line x1='3' y1='10' x2='21' y2='10' stroke='currentColor' strokeWidth='1.6' />
            <line x1='12' y1='5' x2='12' y2='19' stroke='currentColor' strokeWidth='1.6' />
        </g>
    )
    if (type === 'chart') return (
        <g>
            <polyline points='3,17 8,10 13,13 21,4' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
        </g>
    )
    return (
        <g>
            <path d='M7 3h7l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinejoin='round' />
            <polyline points='14,3 14,8 19,8' fill='none' stroke='currentColor' strokeWidth='1.6' />
        </g>
    )
}

function DataAccessibilityViz() {
    const floatKeyframes = FLOATS.map((f, i) => `
        @keyframes davFloat${i} { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(${f.dy}px) } }
    `).join('')

    const floatClasses = FLOATS.map((f, i) => `
        .dav-f${i} { animation: davFloat${i} ${f.dur} ease-in-out infinite ${f.delay}; }
    `).join('')

    return (
        <div className='w-full max-w-2xl'>
            <svg
                viewBox='0 0 720 430'
                className='w-full h-auto'
                aria-label='Data fragmentation across many disconnected Kenyan sources'
                role='img'>
                <defs>
                    <style>{`
                        @media (prefers-reduced-motion: no-preference) {
                            ${floatClasses}
                            .dav-pulse { animation: davPulse 2.6s ease-in-out infinite; }
                            .dav-dash  { animation: davDash 7s linear infinite; }
                        }
                        ${floatKeyframes}
                        @keyframes davPulse { 0%,100% { opacity:0.9 } 50% { opacity:0.3 } }
                        @keyframes davDash  { to { stroke-dashoffset: -60; } }
                    `}</style>
                    <pattern id='davDots' x='0' y='0' width='22' height='22' patternUnits='userSpaceOnUse'>
                        <circle cx='11' cy='11' r='0.95' fill='rgba(21,95,107,0.18)' />
                    </pattern>
                </defs>

                <rect width='720' height='430' fill='url(#davDots)' />

                {/* Connections: researcher → each source */}
                {SOURCES.map((s, i) => {
                    const mx = (s.x + R.x) / 2 + (i % 2 === 0 ? 28 : -28)
                    const my = (s.y + R.y) / 2 - 18
                    return (
                        <path
                            key={i}
                            d={`M ${R.x} ${R.y} Q ${mx} ${my} ${s.x} ${s.y}`}
                            fill='none'
                            stroke={s.broken ? 'rgba(166,93,74,0.32)' : 'rgba(21,95,107,0.22)'}
                            strokeWidth='1.5'
                            strokeDasharray='5 6'
                            className='dav-dash'
                            style={{ animationDelay: `${i * 1.0}s` }}
                        />
                    )
                })}

                {/* Source cards */}
                {SOURCES.map((s) => {
                    const tx = s.x - HW
                    const ty = s.y - HH
                    return (
                        <g key={s.label} className={`dav-f${s.float}`}>
                            <g transform={`translate(${tx}, ${ty})`}>
                                {/* Shadow */}
                                <rect
                                    width={CW} height={CH} rx='13'
                                    fill='rgba(10,37,51,0.08)'
                                    transform='translate(2,4)'
                                />
                                {/* Card */}
                                <rect
                                    width={CW} height={CH} rx='13'
                                    fill='rgba(248,243,237,0.97)'
                                    stroke={s.broken ? 'rgba(166,93,74,0.38)' : 'rgba(21,95,107,0.24)'}
                                    strokeWidth='1.4'
                                />
                                {/* Icon bg */}
                                <rect
                                    x='10' y='10' width='32' height='32' rx='8'
                                    fill={s.broken ? 'rgba(166,93,74,0.1)' : 'rgba(21,95,107,0.1)'}
                                />
                                <g transform='translate(10,10)' color={s.broken ? '#A65D4A' : '#155f6b'}>
                                    <SourceIcon type={s.icon} />
                                </g>

                                {/* Broken badge */}
                                {s.broken && (
                                    <g>
                                        <circle cx={CW - 9} cy='9' r='9' fill='#A65D4A' />
                                        <text
                                            x={CW - 9} y='13'
                                            textAnchor='middle' fontSize='10'
                                            fontWeight='700' fill='white' fontFamily='monospace'>
                                            !
                                        </text>
                                    </g>
                                )}

                                {/* Label */}
                                <text
                                    x={CW / 2} y='54'
                                    textAnchor='middle' fontSize='9.5'
                                    fontWeight='600' fontFamily='sans-serif'
                                    fill='#0A2533'>
                                    {s.label}
                                </text>
                                <text
                                    x={CW / 2} y='66'
                                    textAnchor='middle' fontSize='8'
                                    fontFamily='monospace'
                                    fill='rgba(92,107,110,0.8)'>
                                    {s.sub}
                                </text>
                            </g>
                        </g>
                    )
                })}

                {/* Researcher / analyst */}
                <g transform={`translate(${R.x - 36}, ${R.y - 36})`}>
                    <circle cx='36' cy='36' r='42'
                        fill='none' stroke='rgba(166,93,74,0.12)'
                        strokeWidth='14' className='dav-pulse'
                    />
                    <circle cx='36' cy='36' r='36'
                        fill='rgba(248,243,237,0.97)'
                        stroke='rgba(166,93,74,0.38)' strokeWidth='1.6'
                    />
                    <circle cx='36' cy='28' r='8' fill='#A65D4A' opacity='0.7' />
                    <path d='M18 56 C18 44 54 44 54 56' fill='#A65D4A' opacity='0.5' />
                    <text x='46' y='18' fontSize='12' fill='#A65D4A' fontFamily='sans-serif' fontWeight='600'>?</text>
                    <text x='52' y='28' fontSize='9' fill='rgba(166,93,74,0.45)' fontFamily='sans-serif'>?</text>
                </g>

                {/* Caption */}
                <text
                    x='360' y='415'
                    textAnchor='middle' fontSize='10.5'
                    fontFamily='monospace' fill='rgba(92,107,110,0.75)'>
                    Data professionals stitching together fragments from disconnected sources
                </text>
            </svg>
        </div>
    )
}

export default DataAccessibilityViz
