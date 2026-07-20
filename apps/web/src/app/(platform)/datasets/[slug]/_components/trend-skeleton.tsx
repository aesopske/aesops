export function TrendSkeleton() {
    return (
        <section className='order-1 lg:order-none'>
            <div className='flex items-center gap-3'>
                <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                    Trend
                </span>
                <div className='h-px flex-1 bg-border' />
            </div>
            <div className='mt-4 h-[180px] animate-pulse rounded-xl border border-border bg-card' />
        </section>
    )
}
