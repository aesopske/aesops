import { PortableText, PortableTextComponents } from '@portabletext/react'
import speakingUrl from 'speakingurl'
import { urlForImage } from '@sanity/utils/image'
import Heading from '@components/common/atoms/Heading'
import CodeBlock from '@components/common/organisms/code-block/CodeBlock'
import IframeEmbed from '@components/common/organisms/iframe-embed/IframeEmbed'
import AesopLink from './atoms/AesopLink'
import ImageWithModal from './molecules/image-with-modal/ImageWithModal'
import BlockLinkView from './organisms/BlockLinkView'
import PostNote from './organisms/post-note/PostNote'
import TableBlock from './organisms/table-block/TableBlock'
import YouTubeEmbed from './organisms/youtube-embed/YouTubeEmbed'

function BlockHeading({ children, type }) {
    const url = children[0]?.props?.text
        ? children[0]?.props?.text
        : children[0]

    const id = speakingUrl(url ?? '')

    return (
        <Heading id={id} type={type}>
            {children}
        </Heading>
    )
}

const components = {
    block: {
        h1: ({ children }) => <BlockHeading type='h2'>{children}</BlockHeading>,
        h2: ({ children }) => <BlockHeading type='h3'>{children}</BlockHeading>,

        h3: ({ children }) => <BlockHeading type='h4'>{children}</BlockHeading>,
        h4: ({ children }) => <BlockHeading type='h5'>{children}</BlockHeading>,
        h5: ({ children }) => <BlockHeading type='h6'>{children}</BlockHeading>,

        normal: ({ children }) => (
            <p className='font-serif text-base'>{children}</p>
        ),
        blockquote: ({ children }) => (
            <blockquote className='font-serif text-base italic'>
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
        internalLink: ({ children, value }) => {
            console.log('internalLink', value)
            return null
            // return (
            //     <AesopLink
            //         passHref
            //         href={value.href}
            //         className='text-sm bg-brandprimary-500'>
            //         {children}
            //     </AesopLink>
            // )
        },
    },
} as PortableTextComponents

function ContentReader({ content }: { content: any }) {
    return <PortableText value={content} components={components} />
}

export default ContentReader
