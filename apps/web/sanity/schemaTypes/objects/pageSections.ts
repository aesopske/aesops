import { defineType, defineArrayMember } from 'sanity'

export default defineType({
    name: 'pageSections',
    title: 'Page Sections',
    type: 'array',
    of: [
        defineArrayMember({
            name: 'section',
            title: 'Section',
            type: 'sectionContent',
        }),
    ],
})
