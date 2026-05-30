import { NotepadText } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'page',
    title: 'Pages',
    type: 'document',
    icon: NotepadText,
    groups: [
        { name: 'pageContent', title: 'Page Content', default: true },
        { name: 'postActions', title: 'Post Actions' },
        { name: 'seo', title: 'SEO' },
    ],
    fields: [
        defineField({
            name: 'pageType',
            group: 'pageContent',
            title: 'Page Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Default Page', value: 'page' },
                    { title: 'Blog Post', value: 'blog' },
                    { title: 'Legal', value: 'legal' },
                ],
                layout: 'dropdown',
            },
            initialValue: 'page',
            validation: (Rule) => Rule.required(),
        }),

        // ── Common fields ──────────────────────────────────────────────────
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
                source: (doc) => {
                    const title = (doc.title as string) ?? ''
                    const base = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    return doc.pageType === 'blog' ? `blog/${base}` : base
                },
                slugify: (input) =>
                    input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-/]/g, ''),
                maxLength: 120,
            },
            validation: (Rule) => Rule.required(),
        }),

        // ── Regular page ───────────────────────────────────────────────────
        defineField({
            name: 'sections',
            title: 'Sections',
            type: 'pageSections',
            group: 'pageContent',
            hidden: ({ document }) => document?.pageType === 'blog',
        }),

        // ── Blog-specific fields ───────────────────────────────────────────
        defineField({
            name: 'mainImage',
            title: 'Cover Image',
            type: 'image',
            group: 'pageContent',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
            hidden: ({ document }) => document?.pageType !== 'blog',
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            group: 'pageContent',
            hidden: ({ document }) => document?.pageType !== 'blog',
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            group: 'pageContent',
            initialValue: () => new Date().toISOString(),
            hidden: ({ document }) => document?.pageType !== 'blog',
        }),
        defineField({
            name: 'author',
            title: 'Authors',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'author' } }],
            group: 'pageContent',
            hidden: ({ document }) => document?.pageType !== 'blog',
            validation: (Rule) =>
                Rule.custom((value, context) => {
                    if (
                        context.document?.pageType === 'blog' &&
                        (!value || (value as unknown[]).length === 0)
                    ) {
                        return 'At least one author is required for blog posts'
                    }
                    return true
                }),
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'category' } }],
            group: 'pageContent',
            hidden: ({ document }) => document?.pageType !== 'blog',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
            group: 'pageContent',
            hidden: ({ document }) => document?.pageType !== 'blog',
        }),

        // ── Blog post actions ──────────────────────────────────────────────
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            group: 'postActions',
            initialValue: false,
            hidden: ({ document }) => document?.pageType !== 'blog',
        }),

        // ── SEO (common) ───────────────────────────────────────────────────
        defineField({
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            group: 'seo',
            hidden: ({ document }) => document?.pageType === 'blog',
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            group: 'seo',
            hidden: ({ document }) => document?.pageType === 'blog',
        }),
        defineField({
            name: 'keywords',
            title: 'Keywords',
            type: 'string',
            group: 'seo',
            description: 'Comma-separated list of keywords',
        }),
        defineField({
            name: 'ogimage',
            title: 'OG Image',
            type: 'image',
            group: 'seo',
            hidden: ({ document }) => document?.pageType === 'blog',
            options: { hotspot: true },
        }),
    ],

    preview: {
        select: {
            title: 'title',
            pageType: 'pageType',
            slug: 'slug.current',
            media: 'mainImage',
        },
        prepare({ title, pageType, slug, media }) {
            const type = pageType === 'blog' ? 'Blog Post' : pageType === 'legal' ? 'Legal' : 'Page'
            return {
                title,
                media,
                subtitle: slug ? `${type} · /${slug}` : type,
            }
        },
    },
})
