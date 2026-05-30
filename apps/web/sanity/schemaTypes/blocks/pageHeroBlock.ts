import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { LayoutTemplate } from 'lucide-react'

const Icon = () => createElement(LayoutTemplate, { size: 16 })

export default defineType({
    name: 'pageHeroBlock',
    title: 'Page Hero',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'Small badge text above the heading (e.g. "Blog")',
        }),
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
            name: 'textAlign',
            title: 'Text Alignment',
            type: 'string',
            initialValue: 'center',
            options: {
                list: [
                    { title: 'Left', value: 'left' },
                    { title: 'Center', value: 'center' },
                    { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
        }),
        defineField({
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            initialValue: 'primary',
            options: {
                list: [
                    { title: 'Teal (Primary)', value: 'primary' },
                    { title: 'Deep Teal (Dark)', value: 'dark' },
                    { title: 'Terracotta (Accent)', value: 'accent' },
                    { title: 'Cream (Light)', value: 'light' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
        }),
    ],
    preview: {
        select: { title: 'heading', subtitle: 'label' },
        prepare: ({ title, subtitle }) => ({
            title: title ?? 'Page Hero',
            subtitle: subtitle ? `Label: ${subtitle}` : 'Page Hero block',
        }),
    },
})
