import { User } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'author',
    title: 'Authors',
    icon: User,
    type: 'document',
    fields: [
        defineField({
            name: 'isExternal',
            title: 'External author',
            type: 'boolean',
            initialValue: false,
            description: 'Enable if this author is not a member of the team',
        }),
        defineField({
            name: 'teamMember',
            title: 'Team Member',
            type: 'reference',
            to: [{ type: 'team' }],
            hidden: ({ document }) => !!document?.isExternal,
        }),
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            hidden: ({ document }) => !document?.isExternal,
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            hidden: ({ document }) => !document?.isExternal,
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
            hidden: ({ document }) => !document?.isExternal,
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            hidden: ({ document }) => !document?.isExternal,
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
            hidden: ({ document }) => !document?.isExternal,
        }),
    ],
    preview: {
        select: {
            teamName: 'teamMember.name',
            extName: 'name',
            isExternal: 'isExternal',
            teamMedia: 'teamMember.image',
            extMedia: 'image',
        },
        prepare({ teamName, extName, isExternal, teamMedia, extMedia }) {
            return {
                title: isExternal ? extName : teamName,
                subtitle: isExternal ? 'External Author' : 'Team Member',
                media: isExternal ? extMedia : teamMedia,
            }
        },
    },
})
