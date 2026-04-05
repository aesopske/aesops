import { defineArrayMember, defineType } from 'sanity'
import BlockLinkPreview from '@src/components/sanity/BlockLinkPreview'
import {
    CodeBlockIcon,
    PlayIcon,
    BlockElementIcon,
    ImageIcon,
    ThListIcon,
    BillIcon,
} from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export default defineType({
    title: 'Block Content',
    name: 'blockContent',
    type: 'array',
    of: [
        defineArrayMember({
            title: 'Block',
            type: 'block',
            // Styles let you define what blocks can be marked up as. The default
            // set corresponds with HTML tags, but you can set any title or value
            // you want, and decide how you want to deal with it where you want to
            // use your content.
            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H1', value: 'h1' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
            ],
            lists: [{ title: 'Bullet', value: 'bullet' }],
            // Marks let you mark up inline text in the Portable Text Editor
            marks: {
                // Decorators usually describe a single property – e.g. a typographic
                // preference or highlighting
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                ],
                // Annotations can be any object structure – e.g. a link or a footnote.
                annotations: [
                    {
                        title: 'URL',
                        name: 'link',
                        type: 'object',
                        fields: [
                            {
                                title: 'URL',
                                name: 'href',
                                type: 'url',
                            },
                            {
                                title: 'Open in new tab',
                                name: 'blank',
                                type: 'boolean',
                            },
                        ],
                    },
                ],
            },
        }),
        // You can add additional types here. Note that you can't use
        // primitive types such as 'string' and 'number' in the same array
        // as a block type.
        defineArrayMember({
            name: 'blockLink',
            title: 'Block Link',
            type: 'reference',
            icon: () => '🔗',
            to: [{ type: 'post' }, { type: 'project' }],
            components: {
                preview: BlockLinkPreview,
            },
        }),
        defineArrayMember({
            type: 'image',
            icon: ImageIcon,
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
        }),

        // Adding a code block
        defineArrayMember({
            type: 'codeBlock',
            name: 'code',
            title: 'Code',
            icon: CodeBlockIcon,
        }),

        // Adding a YouTube embed
        defineArrayMember({
            type: 'youTube',
            name: 'youTube',
            icon: PlayIcon,
            title: 'YouTube Embed',
        }),

        // Adding an Iframe embed
        defineArrayMember({
            type: 'iframeEmbed',
            name: 'iframeEmbed',
            title: 'Iframe Embed',
            icon: BlockElementIcon,
        }),

        // Adding a table block
        defineArrayMember({
            type: 'tableBlock',
            name: 'tableBlock',
            title: 'Table Block',
            icon: ThListIcon,
        }),

        // Adding notes block
        defineArrayMember({
            type: 'note',
            name: 'note',
            title: 'Note',
            icon: BillIcon,
        }),
    ],
})
