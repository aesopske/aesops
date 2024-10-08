import { StickyNote } from 'lucide-react'
import { defineField, defineType } from 'sanity'
import NotesPreview from '@src/components/sanity/NotesPreview'

export default defineType({
    name: 'note',
    title: 'Note',
    icon: StickyNote,
    type: 'object',
    fields: [
        defineField({
            title: 'Note Title',
            name: 'noteTitle',
            type: 'string',
        }),
        defineField({
            name: 'note',
            title: 'Your note',
            type: 'blockContent',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: { title: 'noteTitle', note: 'note' },
    },
    components: {
        preview: NotesPreview,
    },
})
