import { defineField, defineType } from 'sanity'
import { createElement } from 'react'
import { ClipboardList } from 'lucide-react'

const Icon = () => createElement(ClipboardList, { size: 16 })

export default defineType({
    name: 'leadFormBlock',
    title: 'Lead Form',
    type: 'object',
    icon: Icon,
    fields: [
        defineField({
            name: 'variant',
            title: 'Form Variant',
            type: 'string',
            initialValue: 'consultation',
            options: {
                list: [
                    { title: 'Consultation request', value: 'consultation' },
                    { title: 'General contact', value: 'contact' },
                ],
                layout: 'radio',
                direction: 'horizontal',
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'submitLabel',
            title: 'Submit Button Label',
            type: 'string',
        }),
        defineField({
            name: 'successMessage',
            title: 'Success Message',
            type: 'text',
            rows: 2,
        }),
    ],
    preview: {
        select: { title: 'heading', subtitle: 'variant' },
        prepare: ({ title, subtitle }) => ({
            title: title ?? 'Lead Form',
            subtitle: subtitle ? `Variant: ${subtitle}` : 'Lead Form block',
        }),
    },
})
