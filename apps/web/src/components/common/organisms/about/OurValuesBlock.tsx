import {
    BriefcaseBusiness,
    Focus,
    Footprints,
    Globe,
    Handshake,
    Heart,
    Lightbulb,
    ShieldCheck,
    Star,
    Target,
} from 'lucide-react'
import React from 'react'
import Animate from '@components/common/atoms/Animate'
import { getValues } from '~sanity/utils/requests'
import { OurValuesBlock as OurValuesBlockType, VALUE } from '~sanity/utils/types'

const VALUE_ICONS: Record<string, React.ReactNode> = {
    footprints: <Footprints className='h-4 w-4' />,
    handshake: <Handshake className='h-4 w-4' />,
    focus: <Focus className='h-4 w-4' />,
    shieldcheck: <ShieldCheck className='h-4 w-4' />,
    briefcasebusiness: <BriefcaseBusiness className='h-4 w-4' />,
    star: <Star className='h-4 w-4' />,
    heart: <Heart className='h-4 w-4' />,
    lightbulb: <Lightbulb className='h-4 w-4' />,
    target: <Target className='h-4 w-4' />,
    globe: <Globe className='h-4 w-4' />,
}

async function OurValuesBlock({ block }: { block: OurValuesBlockType }) {
    const values = (await getValues()) as VALUE[]

    return (
        <section id='values' className='relative w-full overflow-hidden bg-background py-16 lg:py-24'>
            {/* Dot-grid texture */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.05]'
                style={{
                    backgroundImage: 'radial-gradient(circle, #155f6b 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />

            <div className='relative z-10 mx-auto max-w-7xl px-6'>
                {/* Section header */}
                <Animate dir='up' className='mb-12 space-y-3'>
                    <div className='flex items-center gap-3'>
                        <div className='h-px w-5 bg-primary' />
                        <span className='font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-primary'>
                            Our Values
                        </span>
                    </div>
                    <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight leading-tight text-foreground'>
                        {block.heading ?? 'Values that drive our mission.'}
                    </h2>
                    {block.description && (
                        <p className='text-base leading-relaxed text-muted-foreground max-w-xl'>
                            {block.description}
                        </p>
                    )}
                </Animate>

                {/* Card grid — matches FeaturesSection light variant */}
                <div className='grid gap-px rounded-2xl overflow-hidden bg-border grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'>
                    {values.map((item: VALUE, idx: number) => (
                        <Animate key={item._key} dir='up' duration={0.45 + idx * 0.06}>
                            <div className='group relative flex flex-col gap-5 p-7 h-full overflow-hidden bg-background transition-all duration-300'>
                                {/* Muted index */}
                                <span className='absolute right-6 top-5 font-mono text-4xl font-bold leading-none select-none text-foreground/[0.05] transition-colors duration-300 group-hover:text-primary/[0.12]'>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>

                                {/* Icon */}
                                <div className='w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/8 text-primary transition-all duration-300 group-hover:bg-primary/14'>
                                    {VALUE_ICONS[item.icon ?? ''] ?? null}
                                </div>

                                <div className='flex flex-col gap-2 flex-1'>
                                    <h3 className='font-sans font-semibold text-base tracking-tight leading-snug text-foreground transition-colors duration-200 group-hover:text-primary'>
                                        {item.value}
                                    </h3>
                                    <p className='text-sm leading-relaxed text-muted-foreground'>
                                        {item.description}
                                    </p>
                                </div>

                                {/* Bottom accent line */}
                                <div className='absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent' />
                            </div>
                        </Animate>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OurValuesBlock
