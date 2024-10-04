import { defineType, defineField } from 'sanity'
import ProjectSelector from '@components/sanity/ProjectSelector'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    groups: [
        {
            name: 'seo',
            title: 'SEO',
        },
        {
            name: 'projectContent',
            title: 'Project Content',
        },
        {
            name: 'actions',
            title: 'Actions',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'projectContent',
            description: 'The title of the project',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'projectContent',
            description: 'The slug for the project',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'blockContent',
            group: 'projectContent',
            description: 'A short description of the project',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            group: 'projectContent',
            description: 'The image for the project',
            validation: (Rule) => Rule.required(),
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
        }),
        defineField({
            name: 'endpoint',
            title: 'Endpoint',
            type: 'string',
            group: 'projectContent',
            description: 'The endpoint for the project',
            components: {
                input: ProjectSelector,
            },
        }),
        defineField({
            name: 'relatedPost',
            title: 'Related Post',
            type: 'array',
            group: 'projectContent',
            description: 'Posts related to this project',
            of: [{ type: 'reference', to: [{ type: 'post' }] }],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'array',
            group: 'projectContent',
            of: [{ type: 'reference', to: [{ type: 'author' }] }],
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'actions',
            description: 'Is this project featured?',
            initialValue: false,
        }),
    ],
})
