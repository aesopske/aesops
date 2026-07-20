import { DatasetPageLayout } from '@/components/platform/dataset/dataset-page-layout'

function SkeletonBlock({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />
}

export default function Loading() {
    return (
        <main className='relative flex flex-col overflow-x-auto'>
            <section className='relative flex-none overflow-hidden bg-primary'>
                {/* dot-grid texture */}
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />

                {/* diagonal scan lines */}
                <svg
                    className='absolute inset-0 w-full h-full pointer-events-none'
                    aria-hidden='true'>
                    <line
                        x1='0'
                        y1='80%'
                        x2='60%'
                        y2='0'
                        stroke='rgba(248,243,237,0.03)'
                        strokeWidth='1'
                    />
                    <line
                        x1='40%'
                        y1='100%'
                        x2='100%'
                        y2='10%'
                        stroke='rgba(248,243,237,0.03)'
                        strokeWidth='1'
                    />
                </svg>

                {/* vignette */}
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />

                <div className='relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16'>
                    <div className='mb-8 h-4 w-48 animate-pulse rounded bg-primary-foreground/15' />
                    <div className='flex items-start gap-4'>
                        <div className='h-12 w-12 shrink-0 animate-pulse rounded-xl bg-primary-foreground/15' />
                        <div className='min-w-0 flex-1 space-y-2'>
                            <div className='h-8 w-2/3 animate-pulse rounded bg-primary-foreground/15' />
                            <div className='h-4 w-1/3 animate-pulse rounded bg-primary-foreground/10' />
                        </div>
                    </div>
                    <div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4'>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className='h-20 animate-pulse rounded-xl bg-primary-foreground/8'
                            />
                        ))}
                    </div>
                </div>
            </section>

            <DatasetPageLayout
                left={
                    <>
                        <SkeletonBlock className='h-64' />
                        <SkeletonBlock className='h-40' />
                    </>
                }
                right={
                    <>
                        <SkeletonBlock className='h-56' />
                        <SkeletonBlock className='h-72' />
                    </>
                }
            />
        </main>
    )
}
