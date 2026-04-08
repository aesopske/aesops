import { defineType } from 'sanity'
import BlockLinkPreview from '@components/sanity/BlockLinkPreview'

export default defineType({
    name: 'blockLink',
    title: 'Block Link',
    type: 'reference',
    icon: () => '🔗',
    to: [{ type: 'post' }],
    components: {
        preview: BlockLinkPreview,
    },
})
