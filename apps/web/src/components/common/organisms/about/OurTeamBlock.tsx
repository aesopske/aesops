import { Badge } from '@components/ui/badge'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import TeamMemberCard from '@components/common/organisms/about/TeamMemberCard'
import { getCoreMembers } from '~sanity/utils/requests'
import { TEAM, OurTeamBlock as OurTeamBlockType } from '~sanity/utils/types'

async function OurTeamBlock({ block }: { block: OurTeamBlockType }) {
    const members = (await getCoreMembers()) as TEAM[]

    return (
        <section id='team' className='bg-background'>
            <div className='max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) mx-auto px-6 2xl:px-0'>
                <div className='py-16 lg:py-24 space-y-12'>
                    <div className='space-y-4 max-w-xl'>
                        <Badge className='rounded-full'>Our Team</Badge>
                        <Heading type='h2' className='text-current'>
                            {block.heading ?? 'Meet the Team'}
                        </Heading>
                        {block.description && (
                            <Text className='text-muted-foreground max-w-lg leading-relaxed'>
                                {block.description}
                            </Text>
                        )}
                    </div>

                    {members.length > 0 ? (
                        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6'>
                            {members.map((member: TEAM) => (
                                <TeamMemberCard
                                    key={member.slug?.current}
                                    member={member}
                                />
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
            </div>
        </section>
    )
}

export default OurTeamBlock
