import React from 'react'
import MarkDown from 'react-markdown'
import { Box, Image, Text, useColorMode } from '@chakra-ui/react'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'

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
                                colorMode === 'light'
                                    ? '#555'
                                    : 'whiteAlpha.700'
                            }>
                            {children}
                        </Text>
                    )
                },
            }}>
            {content}
        </MarkDown>
    )
}

export default MarkdownReader
