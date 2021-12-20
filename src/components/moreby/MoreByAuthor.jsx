import React from 'react'
import { Box, Heading, VStack, Grid, Text } from '@chakra-ui/react'
import MoreByAuthorItem from './MoreByAuthorItem'

function MoreByAuthor({ user, posts }) {
    return (
        <Box>
            <VStack justifyContent='flex-start' alignItems='flex-start'>
                <Heading size='md' fontWeight='800'>
                    More from {user.name}
                </Heading>
            </VStack>
            <Box height='auto' minHeight='20vh'>
                <Grid>
                    {posts &&
                        posts.map((post) => (
                            <MoreByAuthorItem key={post._id} post={post} />
                        ))}
                </Grid>
                {!posts.length && (
                    <Text mt='2rem'>😧 No more articles from author</Text>
                )}
            </Box>
        </Box>
    )
}

export default MoreByAuthor
