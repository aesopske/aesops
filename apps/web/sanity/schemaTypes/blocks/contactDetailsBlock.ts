import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { AtSign } from 'lucide-react'

const Icon = () => createElement(AtSign, { size: 16 })

export default defineType({
    name: 'contactDetailsBlock',
    title: 'Contact Details',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            initialValue: 'Other ways to reach us',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
    ],
    preview: {
        select: { title: 'heading' },
        prepare: ({ title }) => ({
            title: title ?? 'Contact Details',
            subtitle: 'Emails + social links',
        }),
    },
})
