import { Metadata } from 'next'
import { api } from '@/trpc/server'
import { MessagesSquare } from 'lucide-react'
import CommunityShowcase from '@/components/common/CommunityShowcase'
import { CommunityFeatureCard } from '@/components/platform/community/community-feature-card'

export const metadata: Metadata = { title: 'Community · Aesops' }

export default async function CommunityPage() {
    const threadCount = await api.community.countThreads().catch(() => 0)

    return (
        <main className='flex flex-col'>
            {/* Hero */}
            <section className='relative overflow-hidden bg-primary text-primary-foreground'>
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
                <div
                    aria-hidden
                    className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15'
                />

                <div className='relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:py-16'>
                    <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-8'>
                        <div className='flex flex-col items-center text-center gap-5 lg:items-start lg:text-left'>
                            <span className='inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium tracking-wide'>
                                Aesops Community
                            </span>
                            <h1 className='font-sans font-light text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-primary-foreground max-w-3xl'>
                                Where data people gather
                            </h1>
                            <p className='text-base md:text-lg leading-relaxed max-w-xl text-primary-foreground/60'>
                                Discuss datasets, share what you build, and
                                learn alongside the people shaping open data in
                                the region.
                            </p>
                        </div>

                        <CommunityShowcase />
                    </div>
                </div>
            </section>

            {/* Feature showcase */}
            <div className='mx-auto w-full max-w-6xl px-6 py-16 lg:py-20'>
                <div className='mb-8 flex items-center gap-3'>
                    <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                        Explore the community
                    </span>
                    <div className='h-px flex-1 bg-border' />
                </div>

                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    <CommunityFeatureCard
                        icon={MessagesSquare}
                        title='Discussions'
                        description='Start threads about datasets, ask questions, and tag @aisops for instant, data-grounded answers.'
                        href='/community/discussions'
                        stat={`${threadCount} ${threadCount === 1 ? 'thread' : 'threads'}`}
                    />
                </div>
            </div>
        </main>
    )
}
