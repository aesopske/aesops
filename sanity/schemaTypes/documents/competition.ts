import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'competition',
    title: 'Competition',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'overview',
            title: 'Overview',
            type: 'postContent',
        }),
        defineField({
            name: 'dataset',
            title: 'Dataset',
            type: 'reference',
            to: [{ type: 'dataset' }],
        }),
    ],
})
