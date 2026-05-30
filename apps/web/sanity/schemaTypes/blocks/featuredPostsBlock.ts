import { defineArrayMember, defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Star } from 'lucide-react'

const Icon = () => createElement(Star, { size: 16 })

export default defineType({
    name: 'featuredPostsBlock',
    title: 'Featured Posts',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Featured Stories',
        }),
        defineField({
            name: 'posts',
            title: 'Posts',
            type: 'array',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
            validation: (Rule) => Rule.max(4),
        }),
    ],
    preview: {
        select: { title: 'heading' },
        prepare: ({ title }) => ({ title: title ?? 'Featured Posts', subtitle: 'Featured posts block' }),
    },
})
