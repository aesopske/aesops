import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { Sparkles } from 'lucide-react'

const Icon = () => createElement(Sparkles, { size: 16 })

export default defineType({
    name: 'aiShowcaseBlock',
    title: 'AI Showcase',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'overline',
            title: 'Overline',
            type: 'string',
            initialValue: 'Aesops AI',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Intelligence woven into every interaction',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'ctaLabel',
            title: 'CTA Label',
            type: 'string',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'url',
            validation: (Rule) => Rule.uri({ allowRelative: true }),
        }),
    ],
    preview: {
        select: { title: 'heading' },
        prepare: ({ title }) => ({
            title: title ?? 'AI Showcase',
            subtitle: 'Chat + discussion AI features',
        }),
    },
})
