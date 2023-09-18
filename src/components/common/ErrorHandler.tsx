import React from 'react'
import { Alert, AlertIcon, Box, Heading, Text } from '@chakra-ui/react'

function ErrorHandler({ error }) {
    return (
        <Box p='20px'>
            <Heading size='2xl' my='2rem'>
                Oops!! We have an opsy
            </Heading>
            <Alert borderRadius='10px' status='error' alignItems='flex-start'>
                <AlertIcon />
                <Text fontSize='sm'>{error.message}</Text>
            </Alert>
        </Box>
    )
}

export default ErrorHandler
