import { defineArrayMember, defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { LayoutGrid } from 'lucide-react'

const Icon = () => createElement(LayoutGrid, { size: 16 })

const ICON_OPTIONS = [
    { title: 'Database', value: 'database' },
    { title: 'Search', value: 'search' },
    { title: 'Upload', value: 'upload' },
    { title: 'Bar Chart', value: 'chart' },
    { title: 'AI / Sparkles', value: 'sparkles' },
    { title: 'Users', value: 'users' },
    { title: 'Download', value: 'download' },
    { title: 'Table', value: 'table' },
    { title: 'File', value: 'file' },
    { title: 'Book', value: 'book' },
    { title: 'Zap', value: 'zap' },
    { title: 'Shield', value: 'shield' },
]

export default defineType({
    name: 'featuresBlock',
    title: 'Features',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'overline',
            title: 'Overline',
            type: 'string',
            description: 'Small label above the heading (e.g. "Platform", "The Problem")',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Platform Features',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'variant',
            title: 'Background',
            type: 'string',
            options: {
                list: [
                    { title: 'Light', value: 'light' },
                    { title: 'Dark', value: 'dark' },
                ],
                layout: 'radio',
            },
            initialValue: 'light',
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'icon',
                            title: 'Icon',
                            type: 'string',
                            options: { list: ICON_OPTIONS, layout: 'dropdown' },
                            initialValue: 'database',
                        }),
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
                            rows: 2,
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'link',
                            title: 'Link URL',
                            type: 'url',
                            validation: (Rule) =>
                                Rule.uri({ allowRelative: true }),
                        }),
                        defineField({
                            name: 'linkLabel',
                            title: 'Link Label',
                            type: 'string',
                        }),
                    ],
                    preview: {
                        select: { title: 'title', subtitle: 'description' },
                    },
                }),
            ],
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
            description: 'Optional image displayed beside the heading and description',
        }),
        defineField({
            name: 'ctaLabel',
            title: 'CTA Label',
            type: 'string',
            description: 'Optional bottom call-to-action button label',
        }),
        defineField({
            name: 'ctaLink',
            title: 'CTA Link',
            type: 'url',
            validation: (Rule) => Rule.uri({ allowRelative: true }),
        }),
    ],
    preview: {
        select: { title: 'heading', count: 'features' },
        prepare: ({ title, count }) => ({
            title: title ?? 'Features',
            subtitle: `${Array.isArray(count) ? count.length : 0} feature cards`,
        }),
    },
})
