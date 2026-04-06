import { Database } from 'lucide-react'
import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'dataset',
    title: 'Datasets',
    type: 'document',
    icon: Database,
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
            name: 'description',
            title: 'Description',
            type: 'blockContent',
            group: 'postContent',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
        }),

        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'postContent',
            validation: (Rule) => Rule.required(),
        }),

        // TODO: build a datasetUpload schema type and component to handle dataset uploads
        // defineField({
        //     name: 'datasetUpload',
        //     title: 'Dataset Upload',
        //     type: 'datasetUpload',
        //     group: 'postContent',
        // }),
    ],
})
