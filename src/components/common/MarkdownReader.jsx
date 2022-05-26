import React from 'react'
import MarkDown from 'react-markdown'
import { Box, Image, Text, useColorMode } from '@chakra-ui/react'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { duotoneSpace } from 'react-syntax-highlighter/dist/cjs/styles/prism'

function MarkdownReader({ content }) {
    const { colorMode } = useColorMode()
    const pythonSyntax = [
        'def',
        'list',
        'range',
        'for i in range(10):',
        'Flask',
        'requests',
        '__name__',
        '__main__',
        'if __name__ == "__main__":',
        'Blueprint',
        '@app.route',
    ]

    const jsSyntax = [
        'React',
        'ReactDOM',
        'ReactDOMServer',
        'document',
        'window',
        'function',
        'const',
        'let',
        'var',
    ]

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
                                colorMode === 'light' ? 'gray.700' : 'gray.300'
                            }>
                            {children}
                        </Text>
                    )
                },
                code: ({ children }) => {
                    let language = 'bash'

                    if (
                        jsSyntax.some((syntax) => children[0].includes(syntax))
                    ) {
                        language = 'javascript'
                    }

                    if (
                        pythonSyntax.some((syntax) =>
                            children[0].includes(syntax)
                        )
                    ) {
                        language = 'python'
                    }

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
