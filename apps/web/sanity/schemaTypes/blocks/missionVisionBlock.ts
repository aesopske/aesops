import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Rocket } from 'lucide-react'

const Icon = () => createElement(Rocket, { size: 16 })

export default defineType({
    name: 'missionVisionBlock',
    title: 'Mission & Vision',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'missionTitle',
            title: 'Mission Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'missionDescription',
            title: 'Mission Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'visionTitle',
            title: 'Vision Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'visionDescription',
            title: 'Vision Description',
            type: 'text',
            rows: 3,
        }),
    ],
    preview: {
        select: { mission: 'missionTitle', vision: 'visionTitle' },
        prepare: ({ mission, vision }) => ({
            title: 'Mission & Vision',
            subtitle: [mission, vision].filter(Boolean).join(' · '),
        }),
    },
})
