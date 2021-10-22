import React from 'react'
import { Box, Heading, VStack, Grid } from '@chakra-ui/react'
import MoreByAuthorItem from './MoreByAuthorItem'

function MoreByAuthor({ user, posts }) {
    return (
        <Box mt='1rem'>
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
            </Box>
        </Box>
    )
}

export default MoreByAuthor
