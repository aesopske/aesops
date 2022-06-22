import { Box, Stack } from '@chakra-ui/react'
import React from 'react'

function Overflow({ children }) {
    return (
        <Box as='section' my={['1rem', '1rem', '2rem']}>
            <Box overflow='hidden'>
                <Stack
                    direction='row'
                    spacing='8'
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

export default Overflow
