import React from 'react'
import { Box, Stack, useColorMode, Heading } from '@chakra-ui/react'
import UserAvatar from '@/src/components/common/UserAvatar'

function DatasetHeader({ dataset }) {
    const { colorMode } = useColorMode()
    return (
        <Box
            height='30vh'
            my='1rem'
            borderRadius='10px'
            bgImage={
                colorMode === 'light'
                    ? 'url(/images/background.png)'
                    : 'url(/svg/hero-dark.svg)'
            }
            bgSize='cover'
            position='relative'
            bgRepeat='no-repeat'>
            <Stack
                height='100%'
                width='100%'
                p={['20px', '20px', '0 30px', '0 60px']}
                direction='column'
                alignItems='flex-start'
                justifyContent='center'
                borderRadius='10px'
                color='#fff'
                spacing='6'>
                <Heading>{dataset?.title}</Heading>
                <UserAvatar
                    user={{
                        name: dataset?.author,
                        date: new Date(dataset?.created).toDateString(),
                    }}
                    onSurface
                />
            </Stack>
        </Box>
    )
}

DatasetHeader.defaultProps = {
    dataset: {},
}

export default DatasetHeader
