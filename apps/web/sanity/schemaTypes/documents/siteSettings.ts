import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

const groups = [
    {
        title: 'SEO',
        name: 'seo',
    },
    {
        title: 'Socials',
        name: 'socials',
    },
    {
        title: 'Navigation',
        name: 'navigation',
    },
]

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    icon: Settings,
    type: 'document',
    groups,
    fields: [
        defineField({
            name: 'title',
            title: 'Site Title',
            type: 'string',
            group: 'seo',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            group: 'seo',
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'text',
            group: 'seo',
        }),
        defineField({
            name: 'ogImage',
            title: 'Open Graph Image',
            type: 'image',
            group: 'seo',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'socials',
            title: 'Socials',
            group: 'socials',
            type: 'array',
            of: [{ type: 'externalLink' }],
        }),
        defineField({
            name: 'navLinks',
            title: 'Navigation Links',
            group: 'navigation',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Label',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'href',
                            title: 'URL',
                            description: 'Use a relative path for internal links (e.g. /about-us)',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'comingSoon',
                            title: 'Coming Soon',
                            type: 'boolean',
                            initialValue: false,
                        }),
                    ],
                },
            ],
        }),
    ],
})
