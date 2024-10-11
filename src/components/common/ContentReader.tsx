import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlForImage } from '@sanity/utils/image'
import CodeBlock from '@components/common/organisms/code-block/CodeBlock'
import IframeEmbed from '@components/common/organisms/iframe-embed/IframeEmbed'
import BlockHeading from './molecules/BlockHeading'
import ImageWithModal from './molecules/image-with-modal/ImageWithModal'
import BlockLinkView from './organisms/BlockLinkView'
import PostNote from './organisms/post-note/PostNote'
import TableBlock from './organisms/table-block/TableBlock'
import YouTubeEmbed from './organisms/youtube-embed/YouTubeEmbed'

const components = {
    block: {
        h1: ({ children }) => <BlockHeading type='h2'>{children}</BlockHeading>,
        h2: ({ children }) => <BlockHeading type='h3'>{children}</BlockHeading>,

        h3: ({ children }) => <BlockHeading type='h4'>{children}</BlockHeading>,
        h4: ({ children }) => <BlockHeading type='h5'>{children}</BlockHeading>,
        h5: ({ children }) => <BlockHeading type='h6'>{children}</BlockHeading>,

        normal: ({ children }) => (
            <p className='font-serif text-base leading-relaxed'>{children}</p>
        ),
        blockquote: ({ children }) => (
            <blockquote className='font-serif text-base my-4 border-l-2 px-2 border-brandprimary-600'>
                {children}
            </blockquote>
        ),
    },
    types: {
        code: ({ value }) => <CodeBlock codeContent={value} />,
        youTube: ({ value }) => {
            return (
                <YouTubeEmbed
                    content={{ url: value?.url, title: value?.title }}
                />
            )
        },
        iframeEmbed: ({ value }) => {
            return (
                <IframeEmbed
                    content={{ src: value?.url, title: value?.title }}
                />
            )
        },
        image: ({ value }) => {
            const src = value ? urlForImage(value) : ''
            return (
                <ImageWithModal
                    src={src}
                    alt={value?.alt || ''}
                    caption={value?.caption || value?.alt || ''}
                />
            )
        },
        tableBlock: ({ value }) => {
            return <TableBlock content={value} />
        },
        note: ({ value }) => {
            return <PostNote content={value} />
        },
        blockLink: ({ value }) => {
            return <BlockLinkView content={value} />
        },
    },
    list: {
        // Ex. 1: customizing common list types
        bullet: ({ children }) => (
            <ul className='list-disc ml-6 font-serif'>{children}</ul>
        ),
        number: ({ children }) => (
            <ol className='list-decimal ml-6 font-serif'>{children}</ol>
        ),

        // Ex. 2: rendering custom lists
        checkmarks: ({ children }) => (
            <ol className='ml-6 font-serif'>✔{children}</ol>
        ),
    },
    marks: {
        link: ({ children, value }) => {
            return (
                <a
                    href={value.href}
                    target={value.blank ? '_blank' : '_self'}
                    rel='noopener noreferrer'
                    className='text-brandprimary-700 underline underline-offset-4 decoration-dashed font-medium'>
                    {children}
                </a>
            )
        },
        internalLink: ({ children }) => {
            //TODO: Implement internal link
            return <p>{children}</p>
        },
    },
} as PortableTextComponents

function ContentReader({ content }: { content: any }) {
    return <PortableText value={content} components={components} />
}

export default ContentReader
