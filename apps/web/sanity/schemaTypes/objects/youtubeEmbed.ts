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
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
        defineField({
            name: 'url',
            type: 'url',
            title: 'YouTube URL',
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'url' },
    },
    components: {
        preview: YouTubePreview,
    },
})
