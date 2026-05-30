import { defineArrayMember, defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Home } from 'lucide-react'

const Icon = () => createElement(Home, { size: 16 })

export default defineType({
    name: 'heroBlock',
    title: 'Hero',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
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
                    title: 'Alternative Text',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'array',
            of: [defineArrayMember({ type: 'cta' })],
        }),
    ],
    preview: {
        select: { title: 'title' },
        prepare: ({ title }) => ({ title: title ?? 'Hero', subtitle: 'Hero block' }),
    },
})
