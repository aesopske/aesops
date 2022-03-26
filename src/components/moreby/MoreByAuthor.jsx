import React from 'react'
import {
    Box,
    Heading,
    Grid,
    Text,
    useColorMode,
    Divider,
    Center,
} from '@chakra-ui/react'
import MoreByAuthorItem from './MoreByAuthorItem'

function MoreByAuthor({ user, posts, current }) {
    const { colorMode } = useColorMode()
    const filtered = posts && posts.filter((post) => post?._id !== current?._id)
    return (
        <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p='10px'
            width='100%'
            borderRadius='10px'>
            <Heading fontSize='md' fontWeight='semibold'>
                More from {user?.name}
            </Heading>
            <Divider my='0.5rem' />
            <Box height='auto'>
                <Grid>
                    {filtered &&
                        filtered.map((post) => (
                            <MoreByAuthorItem key={post._id} post={post} />
                        ))}
                </Grid>
                {!filtered.length && (
                    <Center flexDirection='column' height='100%'>
                        <Text fontSize='sm' fontWeight='400'>
                            😧
                        </Text>
                        <Text mt='1rem' fontSize='sm'>
                            Can&apos;t find more fables by {user?.name}
                        </Text>
                    </Center>
                )}
            </Box>
        </Box>
    )
}

export default MoreByAuthor
