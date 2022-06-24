import React from 'react'
import MarkDown from 'react-markdown'
import { Box, Heading, Image, Text, useColorMode } from '@chakra-ui/react'
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
                            width='100%'
                            color={
                                colorMode === 'light' ? 'gray.700' : 'gray.300'
                            }>
                            {children}
                        </Text>
                    )
                },
                code: (props) => {
                    let language = 'bash'

                    if (
                        jsSyntax.some((syntax) =>
                            props.children[0]?.includes(syntax)
                        )
                    ) {
                        language = 'javascript'
                    }

                    if (
                        pythonSyntax.some((syntax) =>
                            props.children[0]?.includes(syntax)
                        )
                    ) {
                        language = 'python'
                    }

                    return (
                        <Box>
                            <SyntaxHighlighter
                                style={duotoneSpace}
                                language={language}>
                                {props.children[0]}
                            </SyntaxHighlighter>
                        </Box>
                    )
                },
                h1: (props) => (
                    <Heading
                        as='h1'
                        fontSize='3xl'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
                h2: (props) => (
                    <Heading
                        as='h2'
                        fontSize='2xl'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
                h3: (props) => (
                    <Heading
                        as='h3'
                        fontSize='xl'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
                h4: (props) => (
                    <Heading
                        as='h4'
                        fontSize='lg'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
                h5: (props) => (
                    <Heading
                        as='h5'
                        fontSize='md'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
                h6: (props) => (
                    <Heading
                        as='h6'
                        fontSize='md'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
            }}>
            {content}
        </MarkDown>
    )
}

export default MarkdownReader
