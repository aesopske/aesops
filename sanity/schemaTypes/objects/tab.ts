import { defineType, defineField } from 'sanity'

export default defineType({
    title: 'Tab',
    name: 'tab',
    type: 'object',
    description: 'A tab in a tab group',
    fields: [
        defineField({
            title: 'Title',
            name: 'title',
            description: 'Select the tab title',
            type: 'string',
            options: {
                list: [
                    { title: 'Overview', value: 'overview' },
                    { title: 'Dataset', value: 'dataset' },
                    { title: 'Prize', value: 'prize' },
                    { title: 'Rules', value: 'rules' },
                ],
            },
            initialValue: 'overview',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            title: 'Dataset',
            name: 'dataset',
            description:
                'Choose a dataset to use for this competition or leave empty and share details and links below',
            type: 'reference',
            to: [{ type: 'dataset' }],
            hidden: ({ parent }) => parent?.title !== 'dataset',
        }),
        defineField({
            title: 'Content',
            name: 'content',
            type: 'blockContent',
            description: 'The content of the tab',
        }),
    ],
})
