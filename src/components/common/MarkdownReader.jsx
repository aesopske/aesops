import React from 'react'
import MarkDown from 'react-markdown'
import { Box, Image, Text, useColorMode } from '@chakra-ui/react'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
    duotoneSpace,
    duotoneLight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism'

function MarkdownReader({ content }) {
    const { colorMode } = useColorMode()
    return (
        <MarkDown
            className='paragraph'
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                p: ({ node, children }) => {
                    if (node.tagName === 'img') {
                        const image = node.children[0]
                        return (
                            <Box my='1rem'>
                                <Image
                                    src={image.properties.src}
                                    alt={image.properties.alt}
                                    width='100%'
                                    height='auto'
                                    placeholder='/images/placeholder.png'
                                />
                            </Box>
                        )
                    }

                    return (
                        <Text
                            as='p'
                            color={
                                colorMode === 'light' ? 'gray.900' : 'gray.300'
                            }>
                            {children}
                        </Text>
                    )
                },
                code({ className, children }) {
                    // Removing "language-" because React-Markdown already added "language-"
                    const language = className.replace('language-', '')
                    return (
                        <SyntaxHighlighter
                            style={
                                colorMode === 'light'
                                    ? duotoneLight
                                    : duotoneSpace
                            }
                            language={language}>
                            {children[0]}
                        </SyntaxHighlighter>
                    )
                },
                pre({ className, children }) {
                    // Removing "language-" because React-Markdown already added "language-"
                    const language = className.replace('language-', '')
                    return (
                        <SyntaxHighlighter
                            style={duotoneSpace}
                            language={language}>
                            {children[0]}
                        </SyntaxHighlighter>
                    )
                },
            }}>
            {content}
        </MarkDown>
    )
}

export default MarkdownReader
