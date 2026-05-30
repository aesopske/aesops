import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/react'
import { urlForImage } from '~sanity/utils/image'
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
            <p className='font-serif text-base lg:text-lg leading-[1.85] text-foreground'>
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className='my-6 pl-4 border-l-2 border-primary/40 text-muted-foreground font-serif text-base lg:text-lg leading-relaxed italic'>
                {children}
            </blockquote>
        ),
    },
    types: {
        code: ({ value }) => <CodeBlock codeContent={value} />,
        youTube: ({ value }) => (
            <YouTubeEmbed content={{ url: value?.url, title: value?.title }} />
        ),
        iframeEmbed: ({ value }) => (
            <IframeEmbed content={{ src: value?.url, title: value?.title }} />
        ),
        image: ({ value }) => {
            const src = value ? (urlForImage(value) ?? '') : ''
            if (!src) return null
            return (
                <ImageWithModal
                    src={src}
                    alt={value?.alt || ''}
                    caption={value?.caption || value?.alt || ''}
                />
            )
        },
        tableBlock: ({ value }) => <TableBlock content={value} />,
        note: ({ value }) => <PostNote content={value} />,
        blockLink: ({ value }) => <BlockLinkView content={value} />,
    },
    list: {
        bullet: ({ children }) => (
            <ul className='my-4 ml-6 list-disc space-y-1.5 font-serif text-base lg:text-lg leading-relaxed text-foreground'>
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className='my-4 ml-6 list-decimal space-y-1.5 font-serif text-base lg:text-lg leading-relaxed text-foreground'>
                {children}
            </ol>
        ),
        checkmarks: ({ children }) => (
            <ol className='my-4 ml-6 space-y-1.5 font-serif text-base lg:text-lg leading-relaxed text-foreground'>
                {children}
            </ol>
        ),
    },
    marks: {
        link: ({ children, value }) => (
            <a
                href={value.href}
                target={value.blank ? '_blank' : '_self'}
                rel='noopener noreferrer'
                className='text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors duration-150 font-medium'>
                {children}
            </a>
        ),
        internalLink: ({ children }) => <span>{children}</span>,
        strong: ({ children }) => (
            <strong className='font-semibold text-foreground'>{children}</strong>
        ),
        em: ({ children }) => (
            <em className='italic text-foreground/80'>{children}</em>
        ),
        code: ({ children }) => (
            <code className='font-mono text-sm bg-muted text-foreground px-1.5 py-0.5 rounded-md'>
                {children}
            </code>
        ),
    },
} as PortableTextComponents

function ContentReader({ content }: { content: PortableTextBlock[] }) {
    return (
        <div className='space-y-5'>
            <PortableText value={content} components={components} />
        </div>
    )
}

export default ContentReader
