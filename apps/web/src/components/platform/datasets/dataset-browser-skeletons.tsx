export function SkeletonRow() {
    return (
        <div className='animate-pulse rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm'>
            {/* icon + name + meta */}
            <div className='flex items-center gap-4'>
                <div className='h-8 w-8 shrink-0 rounded-lg bg-muted' />
                <div className='min-w-0 flex-1 space-y-1.5'>
                    <div className='h-3.5 w-2/3 rounded bg-muted' />
                    <div className='h-3 w-1/3 rounded bg-muted' />
                </div>
            </div>

            {/* description */}
            <div className='mt-2 space-y-1.5'>
                <div className='h-3 w-full rounded bg-muted' />
                <div className='h-3 w-4/5 rounded bg-muted' />
            </div>

            {/* category + tags */}
            <div className='mt-2 flex flex-wrap gap-1.5'>
                <div className='h-5 w-16 rounded-full bg-muted' />
                <div className='h-5 w-12 rounded-full bg-muted' />
                <div className='h-5 w-14 rounded-full bg-muted' />
            </div>

            {/* stats + preview button */}
            <div className='mt-3 flex items-center gap-4'>
                <div className='h-4 w-24 rounded bg-muted' />
                <div className='ml-auto h-7 w-20 rounded-md bg-muted' />
            </div>
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className='animate-pulse rounded-xl border border-border bg-card p-4'>
            {/* header row */}
            <div className='flex items-start gap-3'>
                <div className='h-10 w-10 shrink-0 rounded-lg bg-muted' />
                <div className='min-w-0 flex-1 space-y-2'>
                    <div className='h-4 w-3/4 rounded bg-muted' />
                    <div className='h-3 w-1/3 rounded bg-muted' />
                </div>
            </div>

            {/* description */}
            <div className='mt-2 space-y-1.5'>
                <div className='h-3 w-full rounded bg-muted' />
                <div className='h-3 w-5/6 rounded bg-muted' />
            </div>

            {/* category + tags */}
            <div className='mt-2 flex flex-wrap gap-1.5'>
                <div className='h-5 w-16 rounded-full bg-muted' />
                <div className='h-5 w-12 rounded-full bg-muted' />
                <div className='h-5 w-14 rounded-full bg-muted' />
            </div>

            {/* stats */}
            <div className='mt-3 h-4 w-1/3 rounded bg-muted' />

            {/* column pills */}
            <div className='mt-3 flex flex-wrap gap-1.5'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='h-5 w-16 rounded-full bg-muted' />
                ))}
            </div>

            {/* preview link */}
            <div className='mt-3 flex justify-end'>
                <div className='h-6 w-24 rounded bg-muted' />
            </div>
        </div>
    )
}

export function DatasetBrowserSkeleton() {
    return (
        <div className='flex flex-col gap-6'>
            <div className='space-y-1.5'>
                <div className='h-11 max-w-md animate-pulse rounded-lg bg-muted' />
            </div>

            <div className='flex items-start gap-6'>
                <div className='min-w-0 flex-1 space-y-3'>
                    <div className='lg:hidden grid grid-cols-1 gap-4'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                    <div className='hidden lg:block space-y-3'>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                </div>

                <aside className='hidden w-80 shrink-0 animate-pulse rounded-xl border border-border bg-card lg:block h-96' />
            </div>
        </div>
    )
}
