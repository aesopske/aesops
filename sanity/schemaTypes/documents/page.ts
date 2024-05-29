import { defineField, defineType } from 'sanity'
import { NotepadText } from 'lucide-react'

export default defineType({
    name: 'page',
    title: 'Pages',
    type: 'document',
    icon: NotepadText,
    groups: [
        { name: 'seo', title: 'SEO' },
        { name: 'pageContent', title: 'Page Content', default: true },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'pageContent',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'pageContent',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sections',
            title: 'Sections',
            type: 'pageSections',
            group: 'pageContent',
        }),
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            group: 'seo',
            validation: (Rule) => Rule.required(),
        }),
    ],

    preview: {
        select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage',
        },
        prepare(selection) {
            const { author } = selection
            return { ...selection, subtitle: author && `by ${author}` }
        },
    },
})
