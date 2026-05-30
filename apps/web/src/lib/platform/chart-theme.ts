export const C = {
    c1: 'var(--chart-1)',
    c2: 'var(--chart-2)',
    c3: 'var(--chart-3)',
    c4: 'var(--chart-4)',
    c5: 'var(--chart-5)',
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
