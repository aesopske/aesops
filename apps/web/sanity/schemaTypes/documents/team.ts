import { Users } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'team',
    title: 'Team Members',
    icon: Users,
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
            name: 'role',
            title: 'Role',
            type: 'string',
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
            name: 'showOnPage',
            title: 'Show on team page',
            type: 'boolean',
            initialValue: false,
            description: 'Display this member in the team section on the about page',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            media: 'image',
            subtitle: 'role',
        },
    },
})
