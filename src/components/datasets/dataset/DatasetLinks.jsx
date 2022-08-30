import React from 'react'
import {
    Box,
    useColorMode,
    Divider,
    HStack,
    Icon,
    Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { RiArticleLine } from 'react-icons/ri'
import slugify from 'slugify'
import AesopBtn from '../../common/atoms/AesopBtn'

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

            <AesopBtn
                label='Go to dataset'
                as='a'
                href={dataset.link}
                target='_blank'
                rel='noreferer noopener'
                isLink
            />
        </Box>
    )
}

DatasetLinks.defaultProps = {
    dataset: {},
}

export default DatasetLinks
