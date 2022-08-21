import { useGa } from '@/src/context/TrackingProvider'
import {
    Badge,
    Box,
    Divider,
    Heading,
    HStack,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

function FilterByCategory({ categories, query }) {
    const { gaEvent } = useGa()
    const router = useRouter()
    const { colorMode } = useColorMode()
    return (
        <Box
            minHeight='15vh'
            borderRadius='lg'
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
            mt={['1rem', '2rem', '3rem', '3rem', '6rem']}
            top={['0', '0', '1rem']}
            left='0'
            zIndex='50'
            p='20px'
            position='sticky'>
            <Heading fontSize='xl'>Filter by category</Heading>
            <Divider my='1rem' />
            <HStack flexWrap='wrap' gap='10px' spacing='0'>
                <Badge
                    p='10px'
                    fontWeight='400'
                    fontSize='sm'
                    colorScheme={
                        router.asPath === '/articles' ? 'purple' : 'gray'
                    }
                    textTransform='capitalize'
                    cursor='pointer'
                    onClick={() => {
                        router.push(
                            {
                                pathname: '/articles',
                            },
                            `${process.env.SITE_URL}/articles`,
                            { shallow: true }
                        )
                    }}
                    borderRadius='full'>
                    <Text>All Articles</Text>
                </Badge>

                {categories &&
                    categories.map((category) => (
                        <Badge
                            key={category?.id}
                            p='10px'
                            fontWeight='500'
                            cursor='pointer'
                            fontSize='sm'
                            colorScheme={
                                query === category?.name ? 'purple' : 'gray'
                            }
                            onClick={() => {
                                gaEvent(
                                    'Fables',
                                    'Filter by category',
                                    category?.name
                                )
                                router.push(
                                    {
                                        pathname: '/articles',
                                        query: {
                                            category: category?.name,
                                        },
                                    },
                                    `/articles?category=${category?.name}`,
                                    { shallow: true }
                                )
                            }}
                            textTransform='capitalize'
                            borderRadius='full'>
                            <Text>{category?.name}</Text>
                        </Badge>
                    ))}
            </HStack>
        </Box>
    )
}

export default FilterByCategory
