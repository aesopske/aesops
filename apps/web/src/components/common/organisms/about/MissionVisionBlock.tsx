import { Rocket, Target } from 'lucide-react'
import Animate from '@components/common/atoms/Animate'
import { MissionVisionBlock as MissionVisionBlockType } from '~sanity/utils/types'

const PANELS = [
    { key: 'mission', Icon: Rocket, overline: 'Our Mission' },
    { key: 'vision', Icon: Target, overline: 'Our Vision' },
] as const

function MissionVisionBlock({ block }: { block: MissionVisionBlockType }) {
    const items = [
        { ...PANELS[0], title: block.missionTitle, description: block.missionDescription },
        { ...PANELS[1], title: block.visionTitle, description: block.visionDescription },
    ]

    return (
        <section id='mission-vision' className='relative w-full overflow-hidden bg-background py-16 lg:py-24'>
            {/* Dot-grid texture */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.07]'
                style={{
                    backgroundImage: 'radial-gradient(circle, #155f6b 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />

            <div className='relative z-10 mx-auto max-w-7xl px-6'>
                <div className='grid gap-px rounded-2xl overflow-hidden bg-border grid-cols-1 md:grid-cols-2'>
                    {items.map(({ key, Icon, overline, title, description }, idx) => (
                        <Animate key={key} dir='up' duration={0.45 + idx * 0.1}>
                            <div className='group relative flex flex-col gap-6 p-8 lg:p-10 bg-background transition-colors duration-300'>
                                {/* Icon */}
                                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15'>
                                    <Icon className='h-5 w-5' />
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='h-px w-4 bg-primary/40' />
                                        <span className='font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-primary/70'>
                                            {overline}
                                        </span>
                                    </div>
                                    <h3 className='font-sans font-black text-2xl leading-tight tracking-tight text-foreground md:text-3xl'>
                                        {title}
                                    </h3>
                                    {description && (
                                        <p className='text-base leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70'>
                                            {description}
                                        </p>
                                    )}
                                </div>

                                {/* Bottom accent line on hover */}
                                <div className='absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary/60 to-primary/20 transition-transform duration-300 group-hover:scale-x-100' />
                            </div>
                        </Animate>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MissionVisionBlock
