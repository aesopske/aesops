import React from 'react'
import { Badge, Box, Heading, useColorMode } from '@chakra-ui/react'
import Link from 'next/link'

function MoreByAuthorItem({ post }) {
    const { colorMode } = useColorMode()
    return (
        <Box mt='0.5rem'>
            <Link href={`/fables/${post?.slug}`} passHref>
                <Heading
                    my='1rem'
                    fontSize='sm'
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
                            textTransform='capitalize'
                            borderRadius='5px'
                            p='5px'
                            fontWeight='500'
                            colorScheme='purple'>
                            {tag}
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
