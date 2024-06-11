import { defineType, defineField } from 'sanity'

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
            name: 'link',
            title: 'Link',
            type: 'customUrl',
        }),
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
