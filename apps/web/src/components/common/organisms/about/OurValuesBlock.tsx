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
import { Badge } from '@components/ui/badge'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import { getValues } from '~sanity/utils/requests'
import {
    OurValuesBlock as OurValuesBlockType,
    VALUE,
} from '~sanity/utils/types'

const VALUE_ICONS: Record<string, React.ReactNode> = {
    footprints: <Footprints className='h-8 w-8' />,
    handshake: <Handshake className='h-8 w-8' />,
    focus: <Focus className='h-8 w-8' />,
    shieldcheck: <ShieldCheck className='h-8 w-8' />,
    briefcasebusiness: <BriefcaseBusiness className='h-8 w-8' />,
    star: <Star className='h-8 w-8' />,
    heart: <Heart className='h-8 w-8' />,
    lightbulb: <Lightbulb className='h-8 w-8' />,
    target: <Target className='h-8 w-8' />,
    globe: <Globe className='h-8 w-8' />,
}

async function OurValuesBlock({ block }: { block: OurValuesBlockType }) {
    const values = (await getValues()) as VALUE[]

    return (
        <section id='values' className='bg-brandaccent-50'>
            <div className='max-w-(--breakpoint-lg) lg:max-w-(--breakpoint-xl) 2xl:max-w-(--breakpoint-2xl) col-span-2 mx-auto px-6 2xl:px-0'>
                <div className='space-y-6 py-6 lg:py-24'>
                    <Badge className='rounded-full'>Our Values</Badge>
                    <Heading type='h2' className='text-current max-w-md'>
                        {block.heading ?? 'Values that drive our mission.'}
                    </Heading>
                    {block.description && (
                        <Text className='text-current font-light max-w-xl'>
                            {block.description}
                        </Text>
                    )}
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 lg:gap-10'>
                        {values.map((item: VALUE) => (
                            <div
                                key={item._key}
                                className='space-y-3 bg-brand-background p-4 rounded-lg shadow-sm'>
                                <span className='text-brandprimary-700'>
                                    {VALUE_ICONS[item.icon ?? ''] ?? null}
                                </span>
                                <Heading type='h4' className='text-current'>
                                    {item.value}
                                </Heading>
                                <Text className='text-current font-light'>
                                    {item.description}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OurValuesBlock
