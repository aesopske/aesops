import React from 'react'
import MarkDown from 'react-markdown'
import {
    Box,
    Code,
    Heading,
    Image,
    ListItem,
    OrderedList,
    Text,
    UnorderedList,
    useColorMode,
} from '@chakra-ui/react'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import { optimizeImage } from '@/utils'

function MarkdownReader({ content }) {
    const { colorMode } = useColorMode()
    const lightMode = colorMode === 'light'

    return (
        <MarkDown
            className='paragraph'
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                p: ({ node, children }) => {
                    if (node.tagName === 'img') {
                        const image = node.children[0] as unknown as {
                            type: string
                            tagName: string
                            properties: {
                                alt: string
                                src: string
                            }
                        }
                        return (
                            <Box my='1rem'>
                                <Image
                                    src={optimizeImage(image.properties?.src)}
                                    alt={image?.properties?.alt}
                                    width='100%'
                                    height='auto'
                                    placeholder='/images/placeholder.png'
                                    borderRadius='lg'
                                />
                            </Box>
                        )
                    }

                    return (
                        <Text
                            as='p'
                            width='100%'
                            color={
                                colorMode === 'light' ? 'gray.600' : 'gray.300'
                            }>
                            {children}
                        </Text>
                    )
                },
                code: (props) => {
                    return (
                        <Code
                            fontFamily='Roboto Mono'
                            width='100%'
                            p='20px'
                            borderRadius='lg'
                            bg={lightMode ? 'gray.200' : 'gray.700'}>
                            {props.children}
                        </Code>
                    )
                },
                h1: (props) => (
                    <Heading
                        as='h1'
                        fontSize='2xl'
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
                        fontSize='lg'
                        my='1rem'
                        color={colorMode === 'light' ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </Heading>
                ),
                h4: (props) => (
                    <Heading
                        as='h4'
                        fontSize='md'
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

                pre: (props) => {
                    const hasCode = props.children.some(
                        (child: React.ReactNode) => {
                            return child.props?.node.tagName === 'code'
                        }
                    )
                    return (
                        <Box
                            as='pre'
                            fontFamily='Roboto Mono'
                            whiteSpace='pre-wrap'
                            overflowX='auto'
                            fontSize='md'
                            borderColor={lightMode ? 'gray.200' : 'gray.700'}
                            p={!hasCode && '20px'}
                            my='1rem'
                            color={lightMode ? 'gray.600' : 'gray.400'}
                            bg={lightMode ? 'gray.200' : 'gray.700'}>
                            {props.children}
                        </Box>
                    )
                },
                ul: (props) => (
                    <UnorderedList color={lightMode ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </UnorderedList>
                ),
                ol: (props) => (
                    <OrderedList color={lightMode ? 'gray.600' : 'gray.300'}>
                        {props.children}
                    </OrderedList>
                ),
                li: (props) => <ListItem>{props.children}</ListItem>,
            }}>
            {content}
        </MarkDown>
    )
}

export default MarkdownReader
