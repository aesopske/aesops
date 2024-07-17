import { Info } from 'lucide-react'
import { defineType, defineField } from 'sanity'

export default defineType({
    title: 'Competition Info',
    name: 'competitionInfo',
    type: 'object',
    icon: Info,
    groups: [
        {
            title: 'Important',
            name: 'important',
            default: true,
        },
        {
            title: 'Optional',
            name: 'optional',
        },
    ],
    fields: [
        defineField({
            title: 'Dataset',
            name: 'dataset',
            description:
                'Choose a dataset to use for this competition or leave empty and share details and links in the dataset info block in the optional group.',
            type: 'reference',
            to: [{ type: 'dataset' }],
            group: 'important',
        }),
        defineField({
            title: 'Overview',
            name: 'overview',
            type: 'blockContent',
            validation: (Rule) => Rule.required(),
            group: 'important',
        }),
        defineField({
            title: 'Dataset Info',
            name: 'datasetInfo',
            description:
                'More information about the dataset. This is optional if you have a dataset.',
            type: 'blockContent',
            group: 'optional',
        }),
        // defineField({
        //     title: 'Data',
        //     name: 'data',
        //     type: 'array',
        //     of: [
        //         {
        //             name: 'dataset',
        //             title: 'Dataset',
        //             type: 'reference',
        //             to: [{ type: 'dataset' }],
        //         },
        //         {
        //             name: 'description',
        //             type: 'blockContent',
        //             title: 'Description',
        //         },
        //     ],
        // }),
        defineField({
            title: 'Prize',
            name: 'prize',
            description: 'The prize for the competition',
            group: 'optional',
            type: 'blockContent',
        }),
        defineField({
            title: 'Rules',
            name: 'rules',
            type: 'blockContent',
            group: 'important',
            validation: (Rule) => Rule.required(),
        }),
    ],
})
