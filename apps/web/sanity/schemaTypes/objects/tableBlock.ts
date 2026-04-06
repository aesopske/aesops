import { Table } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'tableBlock',
    title: 'Table Block',
    type: 'object',
    icon: Table,
    fields: [
        defineField({
            name: 'table',
            title: 'Table',
            type: 'table',
        }),
        defineField({
            name: 'caption',
            title: 'Caption',
            type: 'string',
        }),
    ],
})
