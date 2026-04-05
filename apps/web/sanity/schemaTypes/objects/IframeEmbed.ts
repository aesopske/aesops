import { Frame } from 'lucide-react'
import { defineType, defineField } from 'sanity'

import IframePreview from '@src/components/sanity/IframePreview'

export default defineType({
    name: 'iframeEmbed',
    title: 'Iframe Embed',
    icon: Frame,
    type: 'object',
    fields: [
        defineField({
            name: 'url',
            type: 'url',
            title: 'URL',
        }),
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
        }),
    ],
    preview: {
        select: { title: 'url', subtitle: 'title' },
    },
    components: {
        preview: IframePreview,
    },
})
