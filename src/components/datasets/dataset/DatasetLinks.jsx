import React from 'react'
import {
    Box,
    useColorMode,
    Divider,
    HStack,
    Icon,
    Text,
    Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import { RiArticleLine } from 'react-icons/ri'
import slugify from 'slugify'

function DatasetLinks({ dataset }) {
    const { colorMode } = useColorMode()
    const articleSlug = slugify(dataset?.article)
    return (
        <Box
            height='auto'
            minHeight='10vh'
            borderRadius='10px'
            p='20px'
            width='100%'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}>
            <HStack>
                <Icon as={RiArticleLine} fontSize='lg' />
                {dataset?.article ? (
                    <Link href={`/articles/${articleSlug}`} passHref>
                        <Text
                            cursor='pointer'
                            fontSize='md'
                            _hover={{
                                color:
                                    colorMode === 'light'
                                        ? 'brand.hover'
                                        : 'brand.muted',
                            }}
                            textTransform='capitalize'>
                            {dataset?.article}
                        </Text>
                    </Link>
                ) : (
                    <Text cursor='pointer'>No Related article</Text>
                )}
            </HStack>

            <Divider my='1rem' />

            <Button
                as='a'
                href={dataset.link}
                fontSize='lg'
                height='3rem'
                bg='brand.primary'
                _hover={{ bg: 'brand.hover' }}
                _focus={{ bg: 'brand.hover', outline: 'none' }}
                color='#fff'
                _active={{
                    bg: 'brand.hover',
                    outline: 'none',
                }}>
                Go to dataset
            </Button>
        </Box>
    )
}

DatasetLinks.defaultProps = {
    dataset: {},
}

export default DatasetLinks
