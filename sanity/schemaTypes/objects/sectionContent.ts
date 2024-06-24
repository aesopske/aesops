import { LayoutPanelTop } from 'lucide-react';
import { defineField, defineType } from 'sanity'


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
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
        }),
        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'array',
            of: [{ type: 'cta' }],
        }),
        defineField({
            name: 'posts',
            title: 'Posts',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'post' }] }],
        }),

        defineField({
            name: 'datasets',
            title: 'Datasets',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'dataset' }] }],
        }),
        defineField({
            name: 'values',
            title: 'Values',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'value' }] }],
        }),
        defineField({
            name: 'members',
            title: 'Members',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'author' }],
                    options: { filter: 'isCoreMember' },
                },
            ],
            description: 'Members of the section',
        }),
    ],
})