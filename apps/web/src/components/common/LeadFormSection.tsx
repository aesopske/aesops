import Animate from './atoms/Animate'
import { LeadForm } from './forms/LeadForm'
import { LeadFormBlock } from '~sanity/utils/types'

type LeadFormSectionProps = {
    block: LeadFormBlock
}

function LeadFormSection({ block }: LeadFormSectionProps) {
    return (
        <section id='lead-form' className='relative w-full bg-background py-16 lg:py-20'>
            <div className='relative z-10 mx-auto max-w-2xl px-6 lg:px-8'>
                <Animate dir='up' className='mb-10 text-center'>
                    <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight leading-tight text-foreground'>
                        {block.heading}
                    </h2>
                    {block.description && (
                        <p className='mt-3 text-base leading-relaxed text-muted-foreground'>
                            {block.description}
                        </p>
                    )}
                </Animate>

                <Animate dir='up' duration={0.55}>
                    <LeadForm
                        variant={block.variant}
                        submitLabel={block.submitLabel}
                        successMessage={block.successMessage}
                    />
                </Animate>
            </div>
        </section>
    )
}

export default LeadFormSection
