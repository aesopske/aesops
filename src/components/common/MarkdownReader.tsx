'use client'

import React from 'react'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import MarkDown from 'react-markdown'

import { cn } from '@/lib/utils'
import Text from './atoms/Text'
import Heading from './atoms/Heading'

function MarkdownReader({ content }: { content: string }) {
    return (
        <MarkDown
            className='prose max-w-none w-full tracking-normal'
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                p: ({ node, children }) => {
                    if (node?.tagName === 'img') {
                        const image = node?.children[0] as unknown as {
                            type: string
                            tagName: string
                            properties: {
                                alt: string
                                src: string
                            }
                        }
                        return (
                            <span className='border'>
                                <img
                                    src={
                                        image?.properties?.src ??
                                        '/images/placeholder.png'
                                    }
                                    alt={image?.properties?.alt}
                                    width='100%'
                                    height='auto'
                                    className='rounded-xl w-full h-auto max-h-96 object-cover border'
                                />
                            </span>
                        )
                    }

                    return <Text className='my-2'>{children}</Text>
                },
                code: (props) => {
                    return (
                        <pre className='font-mono w-full p-5 rounded-xl bg-gray-100'>
                            {props.children}
                        </pre>
                    )
                },
                h1: (props) => (
                    <Heading type='h1' className='md:text-3xl my-2'>
                        {props.children}
                    </Heading>
                ),
                h2: (props) => (
                    <Heading
                        type='h2'
                        className='md:text-2xl my-4 font-semibold'>
                        {props.children}
                    </Heading>
                ),
                h3: (props) => (
                    <Heading
                        type='h3'
                        className='md:text-xl my-4 font-semibold'>
                        {props.children}
                    </Heading>
                ),
                h4: (props) => (
                    <Heading type='h4' className='my-4 font-semibold'>
                        {props.children}
                    </Heading>
                ),
                h5: (props) => (
                    <Heading type='h5' className='my-4 font-semibold'>
                        {props.children}
                    </Heading>
                ),

                pre: (props) => {
                    const hasCode =
                        props?.children &&
                        Array.isArray(props?.children) &&
                        props?.children?.some((child: React.ReactNode) => {
                            return child.props?.node.tagName === 'code'
                        })
                    return (
                        <pre
                            className={cn(
                                'whitespace-pre-wrap overflow-x-auto text-md border-gray-100 border rounded-xl my-4 font-mono',
                                hasCode && 'p-5'
                            )}>
                            {props.children}
                        </pre>
                    )
                },
                ul: (props) => (
                    <ul className='my-2 list-disc px-4'>{props.children}</ul>
                ),
                ol: (props) => (
                    <ol className='my-2 list-decimal px-4'>{props.children}</ol>
                ),
                li: (props) => <li>{props.children}</li>,
            }}>
            {content}
        </MarkDown>
    )
}

export default MarkdownReader
