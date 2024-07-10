import {
    FilePieChart,
    FileSearch,
    LayoutDashboard,
    Lightbulb,
    Presentation,
    Speech,
    TableCellsMerge,
} from 'lucide-react'
import React from 'react'

import { SERVICE } from '@sanity/utils/types'

import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'

import ListWrapper from '../common/ListWrapper'

type ServicesProps = {
    services: SERVICE[]
} & React.HTMLAttributes<HTMLDivElement>

function Services({ services }: ServicesProps) {
    const icons = {
        insights: <Lightbulb className='w-8 h-8' />,
        dashboards: <LayoutDashboard className='w-8 h-8' />,
        dialogue: <Speech className='w-8 h-8' />,
        reports: <FilePieChart className='w-8 h-8' />,
        management: <TableCellsMerge className='w-8 h-8' />,
        expertise: <FileSearch className='w-8 h-8' />,
        training: <Presentation className='w-8 h-8' />,
    }
    return (
        <section id='services'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative'>
                    <ListWrapper itemKey='title' list={services ?? []}>
                        {(item: SERVICE) => {
                            const icon = icons[item?.icon]
                            return (
                                <div className='space-y-3 bg-brand-background p-4 rounded-lg'>
                                    <span className='text-brandprimary-700'>
                                        {icon}
                                    </span>
                                    <Heading type='h4' className='text-current'>
                                        {item?.title}
                                    </Heading>
                                    <Text className='text-current font-light'>
                                        {item?.description}
                                    </Text>
                                </div>
                            )
                        }}
                    </ListWrapper>
                </div>
        </section>
    )
}
export default Services
