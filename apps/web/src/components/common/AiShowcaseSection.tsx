import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react'
import TransitionLink from '@components/common/atoms/TransitionLink'
import Animate from '@components/common/atoms/Animate'
import AiShowcaseViz from './AiShowcaseViz'
import { AiShowcaseBlock } from '~sanity/utils/types'

const FEATURES = [
    {
        icon: Sparkles,
        label: 'Chat with any dataset',
        description:
            'Ask questions in plain language — Aisops grounds every answer in the actual column schema and sample rows.',
    },
    {
        icon: MessageSquare,
        label: 'AI replies in discussions',
        description:
            'Mention @aisops in any thread. It reads the linked dataset and the conversation before it replies.',
    },
]

type Props = {
    block: AiShowcaseBlock
}

function AiShowcaseSection({ block }: Props) {
    return (
        <section className='relative w-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/[0.06] py-16 lg:py-24'>
            {/* Dot-grid texture */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.09]'
                style={{
                    backgroundImage: 'radial-gradient(circle, #155f6b 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            {/* Glows */}
            <div
                aria-hidden
                className='pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary/[0.08] blur-3xl'
            />
            <div
                aria-hidden
                className='pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/[0.07] blur-3xl'
            />

            <div className='relative z-10 mx-auto w-full max-w-7xl px-6'>
                <div className='grid items-center gap-14 lg:grid-cols-2 lg:gap-10'>
                    {/* Text column */}
                    <Animate dir='up' className='flex flex-col items-start gap-8'>
                        {/* Section header */}
                        <div className='space-y-4'>
                            <div className='flex items-center gap-3'>
                                <div className='h-px w-5 bg-primary' />
                                <span className='font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-primary'>
                                    {block.overline ?? 'Aesops AI'}
                                </span>
                            </div>
                            <h2 className='max-w-md font-sans text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl'>
                                {block.heading ??
                                    'Intelligence woven into every interaction'}
                            </h2>
                            {block.description && (
                                <p className='max-w-sm text-base leading-relaxed text-muted-foreground'>
                                    {block.description}
                                </p>
                            )}
                        </div>

                        {/* Feature callouts */}
                        <div className='flex flex-col gap-4 w-full max-w-sm'>
                            {FEATURES.map(({ icon: Icon, label, description }) => (
                                <div key={label} className='flex gap-3.5'>
                                    <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary'>
                                        <Icon className='h-4 w-4' />
                                    </div>
                                    <div>
                                        <p className='font-sans text-base font-semibold text-foreground'>
                                            {label}
                                        </p>
                                        <p className='mt-0.5 text-sm leading-relaxed text-muted-foreground'>
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        {block.ctaLabel && block.ctaLink && (
                            <TransitionLink
                                href={block.ctaLink}
                                className='inline-flex items-center gap-1.5 font-mono text-xs font-medium text-primary/70 hover:text-primary hover:gap-2.5 transition-all duration-200'>
                                {block.ctaLabel}
                                <ArrowRight className='h-3.5 w-3.5' />
                            </TransitionLink>
                        )}
                    </Animate>

                    {/* Visualization column */}
                    <Animate dir='up' duration={0.55}>
                        <AiShowcaseViz />
                    </Animate>
                </div>
            </div>
        </section>
    )
}

export default AiShowcaseSection
