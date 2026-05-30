import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { BookOpen } from 'lucide-react'

const Icon = () => createElement(BookOpen, { size: 16 })

export default defineType({
    name: 'ourStoryBlock',
    title: 'Our Story',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                }),
            ],
        }),
    ],
    preview: {
        select: { title: 'heading' },
        prepare: ({ title }) => ({
            title: title ?? 'Our Story',
            subtitle: 'Story block',
        }),
    },
})
