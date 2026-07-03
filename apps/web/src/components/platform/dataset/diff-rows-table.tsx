'use client'

type Props = {
    tone: 'added' | 'removed'
    columns: string[]
    rows: Record<string, unknown>[]
    total: number
}

function cell(v: unknown): string {
    if (v === null || v === undefined) return '—'
    const s = String(v)
    return s.length > 20 ? s.slice(0, 17) + '…' : s
}

// Compact preview table for a few sample rows (added or removed).
export function DiffRowsPreview({ tone, columns, rows, total }: Props) {
    const toneClass = tone === 'added' ? 'text-success' : 'text-destructive'
    const bgClass = tone === 'added' ? 'bg-success/5' : 'bg-destructive/5'
    const colsToShow = columns.slice(0, Math.min(4, columns.length))

    return (
        <div className={`rounded-lg border border-border/50 p-2.5 ${bgClass}`}>
            <div className='mb-2 flex items-center justify-between'>
                <p
                    className={`font-mono text-[10px] font-medium uppercase tracking-widest ${toneClass}`}
                >
                    {tone === 'added' ? 'Added' : 'Removed'} rows (showing {Math.min(5, rows.length)} of{' '}
                    {total.toLocaleString()})
                </p>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse text-[10px]'>
                    <thead>
                        <tr className='border-b border-border/30'>
                            {colsToShow.map((c) => (
                                <th
                                    key={c}
                                    className='whitespace-nowrap px-1.5 py-1 text-left font-medium text-muted-foreground'
                                >
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.slice(0, 5).map((row, i) => (
                            <tr key={i} className='border-b border-border/20 last:border-0'>
                                {colsToShow.map((c) => (
                                    <td
                                        key={c}
                                        className='whitespace-nowrap px-1.5 py-0.75 text-foreground'
                                    >
                                        {cell(row[c])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
