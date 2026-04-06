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
    ],
})
