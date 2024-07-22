import { LayoutList } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Categories',
    icon: LayoutList,
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
            },
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
    ],
})
