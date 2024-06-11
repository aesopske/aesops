import { defineType, defineField, defineArrayMember } from 'sanity'
import { LayoutPanelTop } from 'lucide-react'

export default defineType({
    name: 'sectionContent',
    title: 'Section Content',
    type: 'object',
    icon: LayoutPanelTop,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'useBlock',
            title: 'Use Block',
            type: 'boolean',
            initialValue: false,
            description: 'Use a block instead of text',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'More information about the section',
            hidden: ({ parent }) => parent?.useBlock,
        }),
        defineField({
            name: 'descriptionContent',
            title: 'Description',
            type: 'blockContent',
            description: 'More information about the section',
            hidden: ({ parent }) => !parent?.useBlock,
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            description: 'Image for the section',
            options: { hotspot: true },
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'array',
            of: [{ type: 'cta' }],
        }),
        defineField({
            name: 'moreContent',
            title: 'More Content',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'posts',
                    title: 'Posts',
                    type: 'reference',
                    to: [{ type: 'post' }],
                }),
                defineArrayMember({
                    name: 'datasets',
                    title: 'Datasets',
                    type: 'reference',
                    to: [{ type: 'dataset' }],
                }),
            ],
        }),
    ],
})
