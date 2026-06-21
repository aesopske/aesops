import Animate from '@/components/common/atoms/Animate'
import { DatasetBrowser } from '@/components/platform/datasets/dataset-browser'

export default function DatasetsPage() {
    return (
        <main>
            <section className='relative min-h-[38vh] overflow-hidden flex items-center bg-primary'>
                {/* Dot-grid texture */}
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />

                {/* Diagonal scan lines */}
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

                {/* Vignette */}
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15' />

                <div className='relative z-10 w-full px-6'>
                    <Animate
                        dir='up'
                        className='mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) flex flex-col items-center text-center gap-5 py-16 lg:py-20'>
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
                </div>
            </section>

            <div className='mx-auto max-w-6xl px-6 py-20'>
                <DatasetBrowser />
            </div>
        </main>
    )
}
