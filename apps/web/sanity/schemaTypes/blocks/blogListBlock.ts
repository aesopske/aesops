import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { List } from 'lucide-react'

const Icon = () => createElement(List, { size: 16 })

export default defineType({
    name: 'blogListBlock',
    title: 'Blog List',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'All Posts',
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
            title: title ?? 'Blog List',
            subtitle: 'Searchable blog list',
        }),
    },
})
