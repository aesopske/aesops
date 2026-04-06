import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'customUrl',
    title: 'Custom URL',
    type: 'object',
    fields: [
        defineField({
            name: 'external',
            title: 'URL',
            type: 'url',
            hidden: ({ parent, value }) => !value && !!parent?.internal,
        }),
        defineField({
            name: 'internal',
            title: 'Internal',
            type: 'reference',
            to: [
                { type: 'page' },
                { type: 'post' },
                { type: 'dataset' },
                { type: 'author' },
            ],
            hidden: ({ parent, value }) => !value && !!parent?.external,
        }),
    ],
})
