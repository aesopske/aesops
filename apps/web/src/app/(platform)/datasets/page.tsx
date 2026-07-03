import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import Animate from '@/components/common/atoms/Animate'
import DatasetShowcase from '@/components/common/DatasetShowcase'
import { DatasetBrowser } from '@/components/platform/datasets/dataset-browser'

export default async function DatasetsPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session) {
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
                        <div className='space-y-2'>
                            <h1 className='text-3xl font-semibold tracking-tight'>
                                Explore community datasets
                            </h1>
                            <p className='max-w-md text-sm text-primary-foreground/70'>
                                Browse and search datasets shared by the
                                community. Click any card to inspect columns,
                                data types, and statistics.
                            </p>
                        </div>
                    </div>
                </section>

                <div className='mx-auto max-w-6xl px-6 py-20'>
                    <DatasetBrowser />
                </div>
            </main>
        )
    }

    return (
        <main>
            <section className='relative overflow-hidden bg-primary'>
                {/* Dot-grid texture */}
                <div
                    aria-hidden
                    className='absolute inset-0 opacity-[0.07]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1.4px, transparent 1.4px)',
                        backgroundSize: '22px 22px',
                        maskImage:
                            'radial-gradient(125% 110% at 50% 0%, black 50%, transparent 100%)',
                        WebkitMaskImage:
                            'radial-gradient(125% 110% at 50% 0%, black 50%, transparent 100%)',
                    }}
                />

                {/* Soft glows */}
                <div
                    aria-hidden
                    className='pointer-events-none absolute -left-20 -top-24 h-[26rem] w-[26rem] rounded-full bg-primary-foreground/10 blur-3xl'
                />
                <div
                    aria-hidden
                    className='pointer-events-none absolute right-0 top-8 h-96 w-96 rounded-full bg-accent/15 blur-3xl'
                />
                <div
                    aria-hidden
                    className='pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-primary-foreground/8 blur-3xl'
                />
                <div
                    aria-hidden
                    className='pointer-events-none absolute right-[5%] top-1/2 h-[420px] w-[520px] -translate-y-1/2 rounded-full bg-primary-foreground/[0.13] blur-3xl'
                />

                {/* Vignette */}
                <div aria-hidden className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15' />

                <div className='relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:py-16'>
                    <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-8'>
                        <Animate
                            dir='up'
                            className='flex flex-col items-center text-center gap-5 lg:items-start lg:text-left'>
                            <span className='inline-flex items-center px-3 py-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-[11px] font-mono font-medium tracking-[0.16em] uppercase text-primary-foreground/70'>
                                Open datasets
                            </span>

                            <h1 className='font-sans font-light text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-primary-foreground max-w-3xl'>
                                Explore community datasets
                            </h1>

                            <p className='font-sans text-base md:text-lg leading-relaxed max-w-xl text-primary-foreground/60'>
                                Browse and search datasets shared by the community.
                                Click any card to inspect columns, data types, and
                                statistics.
                            </p>
                        </Animate>

                        <DatasetShowcase />
                    </div>
                </div>
            </section>

            <div className='mx-auto max-w-6xl px-6 py-20'>
                <DatasetBrowser />
            </div>
        </main>
    )
}
