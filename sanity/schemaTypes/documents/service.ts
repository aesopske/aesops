import { HandHelping } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    icon: HandHelping,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The name of the service.',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'A brief description of the service.',
        }),
        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {
                list: [
                    { title: 'Insights', value: 'insights' },
                    { title: 'Dashboards', value: 'dashboards' },
                    { title: 'Dialogue', value: 'dialogue' },
                    { title: 'Reports', value: 'reports' },
                    { title: 'Management', value: 'management' },
                    { title: 'Expertise', value: 'expertise' },
                    { title: 'Training', value: 'training' },
                ],
            },
        }),
    ],
})
