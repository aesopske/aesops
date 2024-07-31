import { User } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Authors',
    icon: User,
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
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
            name: 'bio',
            title: 'Bio',
            type: 'text',
        }),
        defineField({
            name: 'socials',
            title: 'Socials',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                            initialValue: 'github',
                            options: {
                                list: [
                                    { title: 'Github', value: 'github' },
                                    { title: 'LinkedIn', value: 'linkedin' },
                                    { title: 'Twitter', value: 'twitter' },
                                    { title: 'Website', value: 'website' },
                                ],
                            },
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                        },
                    ],
                },
            ],
        }),
        defineField({
            name: 'isCoreMember',
            title: 'Is a core team member',
            type: 'boolean',
            initialValue: false,
        }),

        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
            hidden: ({ document }) => !document?.isCoreMember,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            subtitle: 'slug.current',
        },
        prepare(selection) {
            return {
                title: selection.title,
                subtitle: `/${selection.subtitle}`,
                media: selection.media,
            }
        },
    },
})
