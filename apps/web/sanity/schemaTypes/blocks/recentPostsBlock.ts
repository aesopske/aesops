import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Clock } from 'lucide-react'

const Icon = () => createElement(Clock, { size: 16 })

export default defineType({
    name: 'recentPostsBlock',
    title: 'Recent Posts',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Recent Posts',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'count',
            title: 'Number of posts',
            description: 'How many recent posts to display (3–12)',
            type: 'number',
            initialValue: 6,
            validation: (Rule) => Rule.min(3).max(12),
        }),
    ],
    preview: {
        select: { title: 'heading', count: 'count' },
        prepare: ({ title, count }) => ({
            title: title ?? 'Recent Posts',
            subtitle: `Shows ${count ?? 6} recent posts`,
        }),
    },
})
