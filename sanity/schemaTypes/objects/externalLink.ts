import { defineType } from 'sanity'

export default defineType({
    name: 'externalLink',
    title: 'External Link',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'url',
            title: 'URL',
            type: 'url',
        },
    ],
})
