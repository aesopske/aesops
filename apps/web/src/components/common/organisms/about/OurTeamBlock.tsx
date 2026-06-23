import Animate from '@components/common/atoms/Animate'
import TeamMemberCard from '@components/common/organisms/about/TeamMemberCard'
import { getCoreMembers } from '~sanity/utils/requests'
import { TEAM, OurTeamBlock as OurTeamBlockType } from '~sanity/utils/types'

async function OurTeamBlock({ block }: { block: OurTeamBlockType }) {
    const members = (await getCoreMembers()) as TEAM[]

    return (
        <section id='team' className='relative w-full overflow-hidden bg-background py-16 lg:py-24'>
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
                            Our Team
                        </span>
                    </div>
                    <h2 className='font-sans font-black text-3xl md:text-4xl tracking-tight leading-tight text-foreground'>
                        {block.heading ?? 'Meet the Team'}
                    </h2>
                    {block.description && (
                        <p className='text-base leading-relaxed text-muted-foreground max-w-xl'>
                            {block.description}
                        </p>
                    )}
                </Animate>

                {members.length > 0 ? (
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6'>
                        {members.map((member: TEAM, idx: number) => (
                            <Animate key={member.slug?.current} dir='up' duration={0.45 + idx * 0.06}>
                                <TeamMemberCard member={member} />
                            </Animate>
                        ))}
                    </div>
                ) : (
                    <div className='flex items-center justify-center py-16'>
                        <p className='text-sm text-muted-foreground'>
                            No team members to display yet.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default OurTeamBlock
