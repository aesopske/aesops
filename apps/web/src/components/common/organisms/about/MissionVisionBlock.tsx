import { Rocket, Target } from 'lucide-react'
import { Badge } from '@components/ui/badge'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import { MissionVisionBlock as MissionVisionBlockType } from '~sanity/utils/types'

function MissionVisionBlock({ block }: { block: MissionVisionBlockType }) {
    return (
        <section id='mission-vision' className='my-4'>
            <div className='max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) grid grid-cols-1 md:grid-cols-2 col-span-2 mx-auto px-6 2xl:px-0'>
                <div className='space-y-4 py-6 lg:py-24'>
                    <div className='w-20 h-20 rounded-full bg-brandaccent-100 p-4 text-brandprimary-700'>
                        <Rocket className='h-full w-full' />
                    </div>
                    <Badge className='rounded-full'>Our Mission</Badge>
                    <Heading type='h2' className='text-current max-w-lg'>
                        {block.missionTitle}
                    </Heading>
                    <Text className='text-current font-light max-w-lg'>
                        {block.missionDescription}
                    </Text>
                </div>
                <div className='space-y-4 py-6 lg:py-24'>
                    <div className='w-20 h-20 rounded-full bg-brandaccent-100 p-4 text-brandprimary-700'>
                        <Target className='h-full w-full' />
                    </div>
                    <Badge className='rounded-full'>Our Vision</Badge>
                    <Heading type='h2' className='text-current max-w-lg'>
                        {block.visionTitle}
                    </Heading>
                    <Text className='text-current font-light max-w-lg'>
                        {block.visionDescription}
                    </Text>
                </div>
            </div>
        </section>
    )
}

export default MissionVisionBlock
