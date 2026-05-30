import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Heart } from 'lucide-react'

const Icon = () => createElement(Heart, { size: 16 })

export default defineType({
    name: 'ourValuesBlock',
    title: 'Our Values',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Values that drive our mission.',
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
            title: title ?? 'Our Values',
            subtitle: 'Loads all values from Sanity',
        }),
    },
})
