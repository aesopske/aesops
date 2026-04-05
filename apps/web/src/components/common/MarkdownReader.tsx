'use client'

import React from 'react'
import gfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import MarkDown from 'react-markdown'

import { cn } from '@/lib/utils'
import Text from './atoms/Text'
import Heading from './atoms/Heading'
import Image from 'next/image'

function MarkdownReader({ content }: { content: string }) {
    return (
        <div className='prose max-w-none w-full tracking-normal'>
            <MarkDown
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
                                    <Image
                                        src={
                                            image?.properties?.src ??
                                            '/images/placeholder.png'
                                        }
                                        alt={image?.properties?.alt}
                                        width={300}
                                        height={300}
                                        className='rounded-xl w-full h-auto max-h-96 object-cover border'
                                        unoptimized
                                    />
                                </span>
                            )
                        }

                        return <Text className='my-2'>{children}</Text>
                    },
                    code: (props) => {
                        return (
                            <code className='font-mono w-full p-5 rounded-xl bg-gray-100'>
                                {props.children}
                            </code>
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

                    pre: (props) => (
                        <pre
                            className={cn(
                                'whitespace-pre-wrap overflow-x-auto text-md border-gray-100 border rounded-xl my-4 font-mono p-2',
                            )}>
                            {props.children}
                        </pre>
                    ),
                    ul: (props) => (
                        <ul className='my-2 list-disc px-4'>
                            {props.children}
                        </ul>
                    ),
                    ol: (props) => (
                        <ol className='my-2 list-decimal px-4'>
                            {props.children}
                        </ol>
                    ),
                    li: (props) => <li>{props.children}</li>,
                }}>
                {content}
            </MarkDown>
        </div>
    )
}

export default MarkdownReader
