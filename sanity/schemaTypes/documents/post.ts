import { Rss } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Posts',
    type: 'document',
    icon: Rss,
    groups: [
        {
            title: 'SEO',
            name: 'seo',
        },
        {
            title: 'Post Content',
            name: 'postContent',
            default: true,
        },
        {
            title: 'Post Actions',
            name: 'postActions',
        },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'postContent',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'postContent',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            group: 'postContent',
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
            name: 'categories',
            title: 'Categories',
            type: 'array',
            group: 'postContent',
            of: [{ type: 'reference', to: { type: 'category' } }],
        }),
        defineField({
            type: 'text',
            name: 'excerpt',
            title: 'Excerpt',
            group: 'postContent',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            group: 'postContent',
            type: 'blockContent',
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'author' } }],
            group: 'postContent',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
            group: 'postContent',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'string',
            group: 'seo',
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'postActions',
            initialValue: false,
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
