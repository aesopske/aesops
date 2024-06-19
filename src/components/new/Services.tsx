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

import { SECTION } from '@sanity/utils/types'

import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'

import ListWrapper from '../common/ListWrapper'

const services = [
    {
        title: 'Actionable Insights & Analysis',
        description:
            'We provide actionable insights and analysis services to help you make data-driven decisions.',
        link: '/services/data-science',
        icon: <Lightbulb size={24} />,
    },
    {
        title: 'Interactive Dashboards',
        description:
            'We provide interactive dashboards services to help you visualize your data.',
        link: '/trends',
        icon: <LayoutDashboard size={24} />,
    },
    {
        title: 'Data-Driven Dialogues',
        description:
            'We provide data-driven dialogues services to help you communicate your data.',
        link: '/services/data-analytics',
        icon: <Speech size={24} />,
    },
    {
        title: 'Statistical Analysis & Technical Reports',
        description:
            'We produce data-driven reports and develop statistical models with actionable insights.',
        link: '/services/data-visualization',
        icon: <FilePieChart size={24} />,
    },
    {
        title: 'Comprehensive Data Management',
        description:
            'We provide comprehensive data management services to help you organize your data.',
        link: '/services/machine-learning',
        icon: <TableCellsMerge size={24} />,
    },
    {
        title: 'Big Data & Business Intelligence Expertise',
        description:
            'We provide big data and business intelligence expertise services to help you leverage your data.',
        link: '/services/deep-learning',
        icon: <FileSearch size={24} />,
    },
    {
        title: 'Corporate Training & Empowerment',
        description:
            'We provide corporate training and empowerment services to help you build data-driven teams.',
        link: '/services/natural-language-processing',
        icon: <Presentation size={24} />,
    },
]

type ServicesProps = {
    section: SECTION
} & React.HTMLAttributes<HTMLDivElement>

function Services({ section }: ServicesProps) {
    return (
        <section id='services'>
            <div className='relative isolate px-6 lg:px-8'>
                <div className='mx-auto flex flex-col gap-10 container-fluid max-w-screen-2xl py-10 md:pb-40 lg:pt-20 '>
                    <div className='text-left space-y-4'>
                        <Heading>{section?.title}</Heading>
                        <Text className='leading-8 text-gray-600 max-w-xl'>
                            {section?.description}
                        </Text>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 relative'>
                        <ListWrapper list={services} itemKey='title'>
                            {(item, idx) => (
                                <div className='space-y-4 h-full bg-white  p-6  rounded-md border relative overflow-hidden'>
                                    <div className='h-32 w-32 absolute -right-5 -top-5 bg-aes-light/40 rounded-full flex items-center justify-center'>
                                        <div className='bg-aes-primary text-aes-light h-12 w-12 rounded-full flex items-center justify-center shadow'>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 relative z-10 pt-12'>
                                        <div className='absolute left-2 top-0 pointer-events-none'>
                                            <Heading className='lg:text-9xl text-aes-light/50'>
                                                {idx + 1}
                                            </Heading>
                                        </div>
                                        <div className='flex flex-col gap-2 z-10'>
                                            <Heading
                                                type='h4'
                                                className='text-xl font-bold'>
                                                {item.title}
                                            </Heading>
                                            <Text className='text-gray-600'>
                                                {item.description}
                                            </Text>
                                            {/* <AesopLink href={item.link}>
                                                Learn More &rarr;
                                            </AesopLink> */}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ListWrapper>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Services
