function SkeletonTile() {
    return (
        <div className='animate-pulse rounded-xl border border-border bg-card p-4'>
            <div className='h-3 w-16 rounded bg-muted' />
            <div className='mt-2 h-7 w-20 rounded bg-muted' />
        </div>
    )
}

function SkeletonTable({ rows }: { rows: number }) {
    return (
        <div className='animate-pulse overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
            <div className='h-8 border-b border-border bg-muted/40' />
            <div className='divide-y divide-border'>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className='flex items-center gap-6 px-4 py-2.5'>
                        <div className='h-3 w-24 rounded bg-muted' />
                        <div className='h-3 w-12 rounded bg-muted' />
                        <div className='h-3 w-12 rounded bg-muted' />
                        <div className='h-3 w-12 rounded bg-muted' />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function AiUsageSkeleton() {
    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-5'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonTile key={i} />
                ))}
            </div>

            <div className='animate-pulse rounded-xl border border-border bg-card p-4 shadow-sm'>
                <div className='h-4 w-32 rounded bg-muted' />
                <div className='mt-4 h-[280px] rounded-lg bg-muted/60' />
            </div>

            <div>
                <div className='mb-2 h-4 w-16 animate-pulse rounded bg-muted' />
                <SkeletonTable rows={4} />
            </div>

            <div>
                <div className='mb-2 h-4 w-28 animate-pulse rounded bg-muted' />
                <SkeletonTable rows={3} />
            </div>
        </div>
    )
}
