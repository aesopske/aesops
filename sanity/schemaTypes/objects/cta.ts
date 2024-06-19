import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'cta',
    title: 'Call to Action',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'isExternal',
            title: 'Is link external?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'string',
        }),
        // defineField({
        //     name: 'internalLink',
        //     title: 'Link to',
        //     type: 'reference',
        //     to: { type: 'page' },
        //     hidden: ({ parent, value }) => !value && parent?.useExternal,
        // }),
        defineField({
            name: 'variant',
            title: 'Variant',
            type: 'string',
            options: {
                list: [
                    { title: 'Default', value: 'default' },
                    { title: 'Primary', value: 'primary' },
                    { title: 'Secondary', value: 'secondary' },
                    { title: 'Dark', value: 'dark' },
                ],
            },
            initialValue: 'default',
        }),
    ],
})
