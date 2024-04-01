import { Play } from 'lucide-react'
import { defineType, defineField } from 'sanity'

import YouTubePreview from '@src/components/sanity/YouTubePreview'

export default defineType({
    name: 'youTube',
    title: 'YouTube',
    icon: Play,
    type: 'object',
    fields: [
        defineField({
            name: 'url',
            type: 'url',
            title: 'YouTube URL',
        }),
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
    ],
    preview: {
        select: { title: 'url' },
    },
    components: {
        preview: YouTubePreview,
    },
})
