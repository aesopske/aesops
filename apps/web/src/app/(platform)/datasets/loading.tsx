import { DatasetBrowserSkeleton } from '@/components/platform/datasets/dataset-browser-skeletons'

export default function Loading() {
    return (
        <main>
            <section className='relative bg-primary text-primary-foreground'>
                <div
                    aria-hidden
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='relative mx-auto max-w-6xl px-6 py-16 lg:py-20'>
                    <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-8'>
                        <div className='space-y-3'>
                            <div className='h-8 w-3/4 animate-pulse rounded bg-primary-foreground/15' />
                            <div className='h-4 w-full max-w-md animate-pulse rounded bg-primary-foreground/10' />
                        </div>
                        <div className='hidden h-48 animate-pulse rounded-xl bg-primary-foreground/10 lg:block' />
                    </div>
                </div>
            </section>

            <div className='mx-auto max-w-6xl px-6 py-20'>
                <DatasetBrowserSkeleton />
            </div>
        </main>
    )
}
