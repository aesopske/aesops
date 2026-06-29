import { Sparkles, SendHorizonal } from 'lucide-react'

const COUNTIES = [
    { name: 'Nairobi', value: 4.4 },
    { name: 'Kiambu', value: 2.4 },
    { name: 'Nakuru', value: 2.2 },
    { name: 'Mombasa', value: 1.2 },
    { name: 'Kakamega', value: 1.0 },
]
const MAX_VAL = 4.4

function AiShowcaseViz() {
    return (
        <div className='relative mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0 lg:block lg:h-[560px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .ai-float-a { animation: aiFloatA 7s ease-in-out infinite; }
                    .ai-float-b { animation: aiFloatB 9s ease-in-out infinite; }
                    .ai-float-c { animation: aiFloatC 6.5s ease-in-out infinite; }
                }
                @keyframes aiFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
                @keyframes aiFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
                @keyframes aiFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
            `}</style>

            {/* ── Chat panel ── */}
            <div className='ai-float-a z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.30)] lg:absolute lg:right-0 lg:top-4 lg:w-[380px]'>
                {/* Header */}
                <div className='flex items-center gap-2.5 bg-primary px-4 py-3'>
                    <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15'>
                        <Sparkles className='h-3.5 w-3.5 text-primary-foreground' />
                    </div>
                    <span className='flex-1 font-sans text-sm font-medium text-primary-foreground'>
                        Ask the data
                    </span>
                    <span className='rounded-full bg-primary-foreground/15 px-2.5 py-0.5 font-mono text-[10px] text-primary-foreground/80'>
                        Kenya Population
                    </span>
                </div>

                {/* Messages */}
                <div className='flex flex-col gap-3 px-4 py-4'>
                    {/* User bubble */}
                    <div className='flex justify-end'>
                        <div className='max-w-[78%] rounded-2xl rounded-tr-sm bg-primary/10 px-3.5 py-2.5 text-sm text-foreground'>
                            What are the top counties by population?
                        </div>
                    </div>

                    {/* AI bubble */}
                    <div className='flex justify-start'>
                        <div className='max-w-[92%] rounded-2xl rounded-tl-sm bg-muted/60 px-3.5 py-3 text-sm text-foreground'>
                            <p className='mb-2.5 text-xs text-muted-foreground'>
                                Based on the 2019 census data:
                            </p>
                            <div className='flex flex-col gap-1.5'>
                                {COUNTIES.map((c) => (
                                    <div key={c.name} className='flex items-center gap-2'>
                                        <span className='w-16 shrink-0 font-mono text-[10px] text-muted-foreground'>
                                            {c.name}
                                        </span>
                                        <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-border'>
                                            <div
                                                className='h-full rounded-full bg-primary'
                                                style={{ width: `${(c.value / MAX_VAL) * 100}%` }}
                                            />
                                        </div>
                                        <span className='w-8 shrink-0 text-right font-mono text-[10px] font-medium text-foreground'>
                                            {c.value}M
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input bar */}
                <div className='border-t border-border px-3 py-2.5'>
                    <div className='flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2'>
                        <span className='flex-1 text-xs text-muted-foreground/60'>
                            Ask a question about this dataset…
                        </span>
                        <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground'>
                            <SendHorizonal className='h-3 w-3' />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Discussion / @aisops reply panel ── */}
            <div className='ai-float-b z-30 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.30)] lg:absolute lg:left-0 lg:top-[288px] lg:w-[300px]'>
                {/* Thread label */}
                <div className='border-b border-border px-4 py-2.5'>
                    <p className='font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                        Fuel Prices 2023 · Discussion
                    </p>
                </div>

                <div className='flex flex-col gap-3.5 px-4 py-3.5'>
                    {/* User comment */}
                    <div className='flex gap-2.5'>
                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5A8A7A] text-[10px] font-bold text-white'>
                            JM
                        </div>
                        <div className='min-w-0 flex-1'>
                            <div className='mb-0.5 flex items-center gap-1.5'>
                                <span className='text-xs font-medium text-foreground'>John M.</span>
                                <span className='text-[10px] text-muted-foreground'>2h ago</span>
                            </div>
                            <p className='text-xs leading-relaxed text-foreground/80'>
                                What was the avg petrol price in Q3 2023?{' '}
                                <span className='rounded bg-primary/10 px-1 py-0.5 font-mono text-[10px] font-medium text-primary'>
                                    @aisops
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Aisops AI reply */}
                    <div className='flex gap-2.5'>
                        <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary'>
                            <Sparkles className='h-3.5 w-3.5 text-primary-foreground' />
                        </div>
                        <div className='min-w-0 flex-1'>
                            <div className='mb-0.5 flex items-center gap-1.5'>
                                <span className='text-xs font-medium text-foreground'>Aisops</span>
                                <span className='rounded-full bg-primary/10 px-1.5 py-px font-mono text-[9px] text-primary'>
                                    AI
                                </span>
                                <span className='text-[10px] text-muted-foreground'>just now</span>
                            </div>
                            <p className='text-xs leading-relaxed text-foreground/80'>
                                In Q3 2023, super petrol averaged{' '}
                                <strong className='text-foreground'>KSh 194.68 /L</strong>, peaking
                                at KSh 217 in September — a 12% rise from Q2.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Gemini pill ── */}
            <div className='ai-float-c z-10 flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 shadow-[0_8px_24px_-8px_rgba(10,37,51,0.18)] lg:absolute lg:bottom-0 lg:right-0'>
                <svg viewBox='0 0 24 24' className='h-3.5 w-3.5 shrink-0' aria-hidden='true'>
                    <path
                        d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z'
                        fill='#155f6b'
                        opacity='0'
                    />
                    <path
                        d='M12 3 C 8.5 3, 3 8.5, 3 12 C 3 15.5, 8.5 21, 12 21 C 15.5 21, 21 15.5, 21 12 C 21 8.5, 15.5 3, 12 3 Z'
                        fill='none'
                        stroke='#155f6b'
                        strokeWidth='1.5'
                        opacity='0.3'
                    />
                    <path
                        d='M12 6 L14 10 L18 10 L15 13 L16 17 L12 15 L8 17 L9 13 L6 10 L10 10 Z'
                        fill='#155f6b'
                        opacity='0.7'
                    />
                </svg>
                <span className='font-mono text-[10px] text-muted-foreground'>
                    Powered by Gemini
                </span>
            </div>
        </div>
    )
}

export default AiShowcaseViz
