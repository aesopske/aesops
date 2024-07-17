import { Info, Award } from 'lucide-react'
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'competition',
    title: 'Competition',
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
            name: 'info',
            title: 'Competition Details',
            type: 'competitionInfo',
            description: 'What is the competition about?',
            icon: Info,
            group: 'info',
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
    ],
})
