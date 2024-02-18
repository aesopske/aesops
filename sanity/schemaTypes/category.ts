import { LayoutList } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'category',
    title: 'Category',
    icon: LayoutList,
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
    ],
})
