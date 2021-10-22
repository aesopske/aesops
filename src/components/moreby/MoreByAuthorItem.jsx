import React from 'react'
import { Badge, Box, Heading, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'

function MoreByAuthorItem({ post }) {
    const { colorMode } = useColorMode()
    return (
        <Box mt='0.5rem'>
            <Link href={`/articles/${post?.slug}`} passHref>
                <Heading
                    my='1rem'
                    fontSize='1rem'
                    fontWeight='600'
                    color={colorMode === 'light' ? '#444' : 'gray.400'}
                    cursor='pointer'>
                    {post?.title}
                </Heading>
            </Link>
            <Box>
                {post?.tags &&
                    post?.tags.map((tag, index) => (
                        <Badge
                            key={index}
                            mb='5px'
                            mr='5px'
                            colorScheme='gray'
                            borderRadius='5px'
                            p='5px'
                            fontWeight='600'
                            color='#777'>
                            # {tag}
                        </Badge>
                    ))}
            </Box>
        </Box>
    )
}

MoreByAuthorItem.defaultProps = {
    post: {},
}

export default MoreByAuthorItem
