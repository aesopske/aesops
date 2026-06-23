import { MessagesSquare, Users, Sparkles, ArrowUpRight } from 'lucide-react'

const MEMBERS = [
    { initials: 'NK', color: '#155f6b' },
    { initials: 'AM', color: '#5A8A7A' },
    { initials: 'BW', color: '#D4956A' },
    { initials: 'SK', color: '#4CAF50' },
    { initials: 'JO', color: '#7A9E8E' },
]

const THREADS = [
    {
        author: 'Faith K.',
        initials: 'FK',
        color: '#155f6b',
        text: 'Has anyone analyzed the 2024 census data for urban migration trends?',
        time: '2h ago',
        replies: 8,
    },
    {
        author: 'Aisops AI',
        icon: Sparkles,
        text: 'Based on available datasets, urban migration increased 23% in Nairobi MSA…',
        time: '1h ago',
        replies: 4,
    },
]

function CommunityShowcase() {
    return (
        <div className='relative mx-auto flex w-full max-w-md flex-col gap-4 lg:mx-0 lg:block lg:h-[520px] lg:max-w-none'>
            <style>{`
                @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
                    .com-float-a { animation: comFloatA 7s ease-in-out infinite; }
                    .com-float-b { animation: comFloatB 8.5s ease-in-out infinite; }
                    .com-float-c { animation: comFloatC 6.5s ease-in-out infinite; }
                }
                @keyframes comFloatA { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
                @keyframes comFloatB { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
                @keyframes comFloatC { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
            `}</style>

            {/* Discussion thread card — main visual */}
            <div className='com-float-a z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:left-0 lg:top-6 lg:w-[360px]'>
                <div className='flex items-center gap-2.5 border-b border-border px-4 py-3'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        <MessagesSquare className='h-4 w-4' />
                    </div>
                    <span className='font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                        Latest discussions
                    </span>
                </div>

                <div className='flex flex-col divide-y divide-border/50'>
                    {THREADS.map((thread, i) => (
                        <div key={i} className='px-4 py-3.5'>
                            <div className='flex gap-2.5'>
                                {thread.icon ? (
                                    <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                                        <Sparkles className='h-3 w-3' />
                                    </div>
                                ) : (
                                    <div
                                        className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white'
                                        style={{ backgroundColor: thread.color }}>
                                        {thread.initials}
                                    </div>
                                )}
                                <div className='min-w-0 flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-[11px] font-semibold text-foreground'>
                                            {thread.author}
                                        </span>
                                        <span className='text-[10px] text-muted-foreground/60'>
                                            {thread.time}
                                        </span>
                                    </div>
                                    <p className='mt-0.5 text-[11px] leading-relaxed text-foreground/80'>
                                        {thread.text}
                                    </p>
                                    <div className='mt-1.5 flex items-center gap-3'>
                                        <span className='text-[10px] text-muted-foreground/60'>
                                            {thread.replies} replies
                                        </span>
                                        <span className='flex items-center gap-0.5 text-[10px] text-primary'>
                                            View <ArrowUpRight className='h-2.5 w-2.5' />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community stats card — bottom-left */}
            <div className='com-float-b z-30 rounded-2xl border border-border bg-card p-4 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:bottom-4 lg:left-0 lg:w-[220px]'>
                <div className='flex items-center gap-2.5'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                        <Users className='h-4 w-4' />
                    </div>
                    <div>
                        <p className='font-sans text-sm font-semibold text-foreground'>
                            1,240 members
                        </p>
                        <p className='text-[10px] text-muted-foreground'>
                            +48 joined this month
                        </p>
                    </div>
                </div>
            </div>

            {/* Member avatars card — right side */}
            <div className='com-float-c z-10 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_22px_55px_-24px_rgba(10,37,51,0.35)] lg:absolute lg:right-0 lg:top-20 lg:w-[280px]'>
                <div className='flex -space-x-2'>
                    {MEMBERS.map((m) => (
                        <span
                            key={m.initials}
                            className='flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-card text-[9px] font-bold text-white'
                            style={{ backgroundColor: m.color }}>
                            {m.initials}
                        </span>
                    ))}
                </div>
                <div className='min-w-0 flex-1'>
                    <p className='truncate font-sans text-sm font-semibold text-foreground'>
                        Active community
                    </p>
                    <p className='truncate text-[10px] text-muted-foreground'>
                        80+ online now
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CommunityShowcase
