import { BookOpen, Database, MessageSquare, ArrowRight } from 'lucide-react'

const DATASETS = ['Kenya Population', 'Fuel Prices', 'Census 2019', 'Trade Data']

function AesopsOriginViz() {
    return (
        <div className='relative mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0 lg:block lg:h-[480px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .origin-float-a { animation: originFloatA 7s ease-in-out infinite; }
                    .origin-float-b { animation: originFloatB 8.5s ease-in-out infinite; }
                    .origin-float-c { animation: originFloatC 6.5s ease-in-out infinite; }
                    .origin-float-d { animation: originFloatD 9s ease-in-out infinite; }
                }
                @keyframes originFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
                @keyframes originFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
                @keyframes originFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
                @keyframes originFloatD { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
            `}</style>

            {/* ── Blog / article card — the origin ── */}
            <div className='origin-float-a z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:left-0 lg:top-6 lg:w-[272px]'>
                {/* Card header */}
                <div className='flex items-center gap-2.5 border-b border-border px-4 py-3'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary'>
                        <BookOpen className='h-3.5 w-3.5' />
                    </div>
                    <span className='font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                        Data Stories · 2021
                    </span>
                </div>

                {/* Article preview */}
                <div className='px-4 py-4'>
                    <p className='font-sans text-sm font-semibold leading-snug text-foreground'>
                        Kenya's Fuel Price Crisis: What the Numbers Actually Say
                    </p>
                    <p className='mt-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-3'>
                        We dug into KNBS and ERC records to map how pump prices diverged from global crude trends — and what it means for informal trade.
                    </p>

                    {/* Meta */}
                    <div className='mt-3 flex items-center gap-2 text-[10px] text-muted-foreground/70 font-mono'>
                        <span>Mar 2021</span>
                        <span>·</span>
                        <span>5 min read</span>
                    </div>

                    {/* Tags */}
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                        {['#DataStories', '#Kenya', '#EnergyData'].map((tag) => (
                            <span
                                key={tag}
                                className='rounded-full bg-primary/8 px-2 py-0.5 font-mono text-[9px] text-primary'>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Evolution pill — the bridge ── */}
            <div className='origin-float-b z-30 flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 shadow-[0_8px_24px_-8px_rgba(10,37,51,0.20)] lg:absolute lg:bottom-16 lg:left-4'>
                <span className='font-mono text-[10px] text-muted-foreground'>Stories became a platform</span>
                <ArrowRight className='h-3 w-3 shrink-0 text-primary' />
            </div>

            {/* ── Datasets card — the present ── */}
            <div className='origin-float-c z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-0 lg:w-[260px]'>
                <div className='flex items-center gap-2.5 border-b border-border px-4 py-3'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary'>
                        <Database className='h-3.5 w-3.5' />
                    </div>
                    <span className='font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                        Kenya Datasets
                    </span>
                </div>
                <div className='flex flex-col gap-1.5 px-4 py-3.5'>
                    {DATASETS.map((name) => (
                        <div key={name} className='flex items-center gap-2.5'>
                            <div className='h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50' />
                            <span className='text-[11px] text-muted-foreground'>{name}</span>
                        </div>
                    ))}
                    <p className='mt-1 font-mono text-[10px] text-primary'>
                        + 38 more datasets →
                    </p>
                </div>
            </div>

            {/* ── Community card — discussions & learning ── */}
            <div className='origin-float-d z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-[192px] lg:w-[260px]'>
                <div className='flex items-center gap-2.5 border-b border-border px-4 py-3'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-md bg-[#5A8A7A]/15 text-[#5A8A7A]'>
                        <MessageSquare className='h-3.5 w-3.5' />
                    </div>
                    <span className='font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                        Discussions
                    </span>
                </div>
                <div className='flex flex-col gap-3 px-4 py-3.5'>
                    <div className='flex gap-2'>
                        <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#155f6b] text-[8px] font-bold text-white'>JK</div>
                        <p className='text-[11px] leading-relaxed text-foreground/80'>
                            "What does the fuel data mean for transport costs?"
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[8px]'>
                            <span className='text-primary-foreground font-bold'>AI</span>
                        </div>
                        <p className='text-[11px] leading-relaxed text-muted-foreground'>
                            Based on the dataset, transport costs rose 18% in Q3…
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AesopsOriginViz
