import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Users } from 'lucide-react'

const Icon = () => createElement(Users, { size: 16 })

export default defineType({
    name: 'ourTeamBlock',
    title: 'Our Team',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Meet the Team',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
    ],
    preview: {
        select: { title: 'heading' },
        prepare: ({ title }) => ({
            title: title ?? 'Our Team',
            subtitle: 'Loads all core members from Sanity',
        }),
    },
})
