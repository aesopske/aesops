import { Box, Stack, Text } from '@chakra-ui/react'
import React from 'react'

function Overflow({ children, color }) {
    return (
        <Box as='section' my={['1rem', '1rem', '2rem']}>
            <Text mb='1rem' color={color}>
                Swipe &rarr;
            </Text>
            <Box overflow='hidden'>
                <Stack
                    direction='row'
                    spacing='5'
                    justifyContent='space-between'
                    overflowX='scroll'
                    css={{
                        '::-webkit-scrollbar': {
                            display: 'none',
                        },
                        scrollBehavior: 'smooth',
                    }}
                    alignItems='flex-start'>
                    {children}
                </Stack>
            </Box>
        </Box>
    )
}

Overflow.defaultProps = {
    color: 'gray.200',
}

export default Overflow
