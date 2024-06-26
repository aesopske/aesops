import { PortableText, PortableTextComponents } from '@portabletext/react'
import { ImageIcon } from 'lucide-react'
import speakingUrl from 'speakingurl'

import { urlForImage } from '@sanity/utils/image'

import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import CodeBlock from '@components/common/organisms/code-block/CodeBlock'
import IframeEmbed from '@components/common/organisms/iframe-embed/IframeEmbed'

import AesopImage from './AesopImage'
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
                <div className='w-full h-auto bg-brandaccent-50/50 md:rounded-lg overflow-hidden'>
                    <AesopImage
                        width={500}
                        height={300}
                        src={src}
                        alt={value?.alt || ''}
                        className='h-fit w-full object-contain md:rounded-t-lg'
                    />
                    <Text className='w-full italic bg-brandaccent-50 text-gray-500 p-2 px-5 flex items-center gap-2 text-sm md:px-2'>
                        <ImageIcon size={16} />
                        {value?.caption || value?.alt || ''}
                    </Text>
                </div>
            )
        },
        tableBlock: ({ value }) => {
            return <TableBlock content={value} />
        },
        note: ({ value }) => {
            return <PostNote content={value} />
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
} as PortableTextComponents

function ContentReader({ content }: { content: any }) {
    return <PortableText value={content} components={components} />
}

export default ContentReader
