import React from 'react'
import { Box, Image, Text, Stack } from '@chakra-ui/react'

function Unavailable({ message, src }) {
    return (
        <Box
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%,-50%)'
            as={Stack}
            justifyContent='center'
            alignItems='center'>
            <Image
                mb='1rem'
                src={src}
                width='40%'
                height='auto'
                objectFit='contain'
                alt='Unavailable'
            />
            <Text as='p' fontSize='lg'>
                {message}
            </Text>
        </Box>
    )
}

export default Unavailable
