import { Info, Award } from 'lucide-react'
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'competition',
    title: 'Competitions',
    type: 'document',
    icon: Award,
    groups: [
        {
            title: 'Competition Info',
            name: 'info',
            default: true,
        },
        {
            title: 'SEO & Metadata',
            name: 'seo',
        },
        {
            title: 'Actions',
            name: 'actions',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The title of the competition',
            group: 'info',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            group: 'info',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            group: 'info',
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
            name: 'keywords',
            title: 'Keywords',
            description: 'Keywords for SEO',
            type: 'string',
            group: 'seo',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            description: 'A short description of the competition for SEO',
            type: 'text',
            group: 'seo',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
            description: 'Is this competition featured?',
            group: 'actions',
        }),

        defineField({
            name: 'startDate',
            title: 'Start Date',
            description: 'When does the competition start?',
            type: 'datetime',
            options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
            },
            group: 'info',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            description:
                'When does the competition end? Leave empty if the competition is ongoing',
            type: 'datetime',
            options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
            },
            group: 'info',
        }),
        defineField({
            name: 'tabs',
            title: 'Tabs',
            description:
                'Details about the competition. Select the tabs you want to display',
            type: 'array',
            of: [{ type: 'tab' }],
            group: 'info',
        }),
    ],
})
