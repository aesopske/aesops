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
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'blockContent',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
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
