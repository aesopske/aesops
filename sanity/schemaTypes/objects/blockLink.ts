import { defineType } from 'sanity'
import BlockLinkPreview from '@src/components/sanity/BlockLinkPreview'

export default defineType({
    name: 'blockLink',
    title: 'Block Link',
    type: 'reference',
    icon: () => '🔗',
    to: [{ type: 'post' }, { type: 'project' }],
    components: {
        preview: BlockLinkPreview,
    },
})
