import { Database } from 'lucide-react'
import Animate from './atoms/Animate'
import { LeadForm } from './forms/LeadForm'
import { ICON_MAP } from './FeaturesSection'
import { FeaturesBlock, LeadFormBlock } from '~sanity/utils/types'

type FeaturesWithLeadFormSectionProps = {
    featuresBlock: FeaturesBlock
    leadFormBlock: LeadFormBlock
}

function FeaturesWithLeadFormSection({ featuresBlock, leadFormBlock }: FeaturesWithLeadFormSectionProps) {
    const features = featuresBlock.features ?? []

    return (
        <section id='lead-form' className='relative w-full overflow-hidden bg-background py-16 lg:py-20'>
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.05]'
                style={{
                    backgroundImage: 'radial-gradient(circle, #155f6b 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />

            <div className='relative z-10 mx-auto max-w-(--breakpoint-md) lg:max-w-(--breakpoint-lg) 2xl:max-w-(--breakpoint-xl) px-6 lg:px-8'>
                <div className='grid gap-12 lg:grid-cols-2 lg:gap-10 lg:items-center'>
                    {/* Pillars */}
                    <Animate dir='up'>
                        <div className='space-y-2 max-w-xl mb-8'>
                            <div className='flex items-center gap-3'>
                                <div className='w-5 h-px bg-primary' />
                                <span className='text-[10px] font-mono font-medium tracking-[0.22em] uppercase text-primary'>
                                    {featuresBlock.overline ?? 'How we partner with you'}
                                </span>
                            </div>
                            <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight leading-tight text-foreground'>
                                {featuresBlock.heading ?? 'Four ways we unlock measurable ROI'}
                            </h2>
                            {featuresBlock.description && (
                                <p className='text-base leading-relaxed text-muted-foreground pt-1'>
                                    {featuresBlock.description}
                                </p>
                            )}
                        </div>

                        <div className='grid grid-cols-1 gap-px rounded-2xl overflow-hidden bg-border'>
                            {features.map((feature, idx) => {
                                const IconComponent = ICON_MAP[feature.icon ?? 'database'] ?? Database
                                return (
                                    <Animate key={feature._key} dir='up' duration={0.45 + idx * 0.06}>
                                        <div className='group relative flex items-start gap-4 p-6 h-full bg-background transition-all duration-300'>
                                            <div className='w-11 h-11 rounded-lg flex items-center justify-center shrink-0 bg-primary/8 text-primary transition-all duration-300 group-hover:bg-primary/14'>
                                                <IconComponent className='w-5 h-5' />
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <h3 className='font-sans font-semibold text-lg tracking-tight leading-snug text-foreground'>
                                                    {feature.title}
                                                </h3>
                                                <p className='text-sm leading-relaxed text-muted-foreground'>
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Animate>
                                )
                            })}
                        </div>
                    </Animate>

                    {/* Consultation form */}
                    <Animate dir='up' duration={0.55} className='flex justify-center'>
                        <div className='w-full max-w-lg'>
                            <LeadForm
                                variant={leadFormBlock.variant}
                                submitLabel={leadFormBlock.submitLabel}
                                successMessage={leadFormBlock.successMessage}
                            />
                        </div>
                    </Animate>
                </div>
            </div>
        </section>
    )
}

export default FeaturesWithLeadFormSection
