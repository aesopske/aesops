import {
    Box,
    Stack,
    HStack,
    VStack,
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react'
import React from 'react'

function ArticleLoader() {
    return (
        <Stack
            justifyContent='space-between'
            alignItems='center'
            direction={['column-reverse', 'column-reverse', 'row']}
            height={['auto', 'auto', '30vh']}
            width='100%'>
            <VStack
                width={['100%', '100%', '70%']}
                alignItems='flex-start'
                justifyContent='space-between'
                height={['auto', 'auto', '100%']}>
                <Box width='100%'>
                    <Skeleton height='1.3rem' width='60%' borderRadius='full' />
                    <SkeletonText
                        my='1.5rem'
                        width='90%'
                        noOfLines={3}
                        borderRadius='full'
                    />
                </Box>

                <HStack width='100%' justifyContent='space-between'>
                    <HStack spacing='3' width='40%'>
                        <Skeleton
                            height='2.5rem'
                            width='3rem'
                            borderRadius='10px'
                        />
                        <SkeletonText
                            width='80%'
                            borderRadius='full'
                            noOfLines={2}
                        />
                    </HStack>
                    <HStack spacing='3' width='40%'>
                        <Skeleton
                            height='1.5rem'
                            borderRadius='full'
                            width='40%'
                        />
                        <Skeleton
                            height='1.5rem'
                            borderRadius='full'
                            width='40%'
                        />
                    </HStack>
                </HStack>
            </VStack>
            <Skeleton
                borderRadius='10px'
                width={['100%', '100%', '30%']}
                height={['30vh', '30vh', '100%']}
            />
        </Stack>
    )
}

export default ArticleLoader
