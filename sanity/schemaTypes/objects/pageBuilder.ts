import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
    name: 'pagebuilder',
    title: 'Page Builder',
    type: 'array',
    of: [
        defineArrayMember({
            name: 'section',
            title: 'Section',
            type: 'object',
            icon: () => '🦸',
            fields: [
                defineField({
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'tagline',
                    title: 'Tagline',
                    type: 'text',
                }),
                defineField({
                    name: 'image',
                    title: 'Image',
                    type: 'image',
                    options: { hotspot: true },
                }),
            ],
        }),
        defineArrayMember({
            name: 'cta',
            title: 'Call to Action',
            type: 'object',
            icon: () => '📞',
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
                    type: 'url',
                }),
            ],
        }),
    ],
})
