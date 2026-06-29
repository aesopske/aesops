import Animate from '@components/common/atoms/Animate'
import AesopsOriginViz from '@components/common/organisms/about/AesopsOriginViz'
import { OurStoryBlock as OurStoryBlockType } from '~sanity/utils/types'

function OurStoryBlock({ block }: { block: OurStoryBlockType }) {
    return (
        <section id='about' className='relative overflow-hidden bg-primary'>
            {/* Dot-grid texture */}
            <div
                aria-hidden
                className='absolute inset-0 opacity-[0.12]'
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            {/* Vignette */}
            <div aria-hidden className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15' />

            <div className='relative z-10 mx-auto max-w-7xl px-6'>
                <div className='grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:gap-16 lg:py-24'>
                    {/* Text */}
                    <Animate dir='up' className='flex flex-col justify-center gap-5'>
                        <div className='flex items-center gap-3'>
                            <div className='h-px w-5 bg-primary-foreground/50' />
                            <span className='font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60'>
                                Our Story
                            </span>
                        </div>
                        <h2 className='font-sans font-black text-3xl leading-tight tracking-tight text-primary-foreground md:text-4xl lg:text-5xl'>
                            {block.heading}
                        </h2>
                        {block.description && (
                            <p className='max-w-md text-base leading-relaxed text-primary-foreground/65'>
                                {block.description}
                            </p>
                        )}
                    </Animate>

                    {/* Origin visualization */}
                    <Animate dir='up' duration={0.55} className='flex items-center'>
                        <AesopsOriginViz />
                    </Animate>
                </div>
            </div>
        </section>
    )
}

export default OurStoryBlock
