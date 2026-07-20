export const C = {
    c1: 'var(--aeschart-1)',
    c2: 'var(--aeschart-2)',
    c3: 'var(--aeschart-3)',
    c4: 'var(--aeschart-4)',
    c5: 'var(--aeschart-5)',
    c6: 'var(--aeschart-6)',
}

export const TOOLTIP_STYLE = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '12px',
    color: 'var(--foreground)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
} as const

export const TICK_STYLE = { fill: 'var(--muted-foreground)', fontSize: 11 } as const

// Compact axis/tick values: 1, 20, 200, 2.19K, 20K, 200K, 2.19M. `maxFractionDigits`
// defaults to 2 so nearby values (e.g. 2.19M vs 2.20M) stay distinguishable — pass a
// lower value (e.g. 0) to shorten labels when a chart has many crowded data points.
// Trailing zeros are always dropped (minimumFractionDigits defaults to 0).
export function formatCompactNumber(value: number, maxFractionDigits = 2): string {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: maxFractionDigits,
    }).format(value)
}

// Fewer decimals as data points pile up, so per-bar/point value labels stay short
// enough not to collide with each other or the axis labels beneath them. Even a
// single decimal digit was enough to cause collisions once past a handful of bars,
// so this drops straight to whole numbers rather than stepping through 1 first.
export function labelFractionDigits(totalPoints: number): number {
    return totalPoints <= 6 ? 2 : 0
}

// Past a certain density, per-bar/point value labels overlap each other no matter
// how few decimals they carry — hide them entirely rather than render illegible
// text. The tooltip still carries the exact value on hover.
export function shouldShowValueLabels(totalPoints: number): boolean {
    return totalPoints <= 20
}

export function formatLatency(ms: number): string {
    if (ms <= 0) return '—'
    return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`
}
