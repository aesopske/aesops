import {
    Badge,
    Box,
    Divider,
    Grid,
    Heading,
    HStack,
    IconButton,
    Stack,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import Search from '../common/Search'
import ArticleCard from './ArticleCard'
import { useEffect, useState, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchArticles, fetchCategories } from '@/src/utils/requests'
import Unavailable from '../common/Unavailable'
import { useRouter } from 'next/router'
import { FaTimes } from 'react-icons/fa'
import { useGa } from '@/src/context/TrackingProvider'
import ArticleLoader from './ArticleLoader'

function ArticleList({ articles }) {
    const router = useRouter()
    const { gaEvent } = useGa()
    const { colorMode } = useColorMode()
    const [searchterm, setSearchterm] = useState('')
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(false)
    const [text] = useDebounce(searchterm, 500)
    const [categories, setCategories] = useState([])

    const { category: query } = router.query

    const fetchFiltered = useCallback(async (txt) => {
        try {
            setLoading(true)
            const data = await fetchArticles({ keyword: txt })
            setFiltered(data.items)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setFiltered([])
        }
    }, [])

    const getCategories = useCallback(async () => {
        const data = await fetchCategories({ limit: 12 })

        if (data.categories) {
            setCategories(data.categories)
        } else {
            setCategories([])
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (text) {
                fetchFiltered(text)
            }
        }
    }, [text, fetchFiltered])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (query) {
                fetchFiltered(query)
            }
        }
    }, [query, fetchFiltered])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            getCategories()
        }
    }, [getCategories])

    return (
        <Stack
            gap='2rem'
            spacing={['2', '2', '3', '8']}
            flexDir={[
                'column-reverse',
                'column-reverse',
                'column-reverse',
                'row',
            ]}>
            <Box
                height='auto'
                minHeight='70vh'
                my='1rem'
                position='relative'
                width={['100%', '', '', '70%']}>
                <Box mb='3rem'>
                    <Search
                        placeholder='Search by title or tag ...'
                        setTerm={setSearchterm}
                        term={searchterm}
                        label='Search Fables'
                    />
                </Box>

                <Box height='auto' my='4rem'>
                    {text && !filtered.length && (
                        <Unavailable
                            message='😧 The post you are searching for does not exist'
                            src='/images/unavailable.svg'
                        />
                    )}
                </Box>

                {query && (
                    <HStack
                        width='100%'
                        justifyContent='space-between'
                        alignItems='flex-start'
                        my='1rem'>
                        <Heading
                            fontSize='lg'
                            color='gray.500'
                            fontWeight='medium'>
                            {filtered && filtered.length} result
                            {filtered.length > 1 && 's'} for {query}
                        </Heading>

                        <IconButton
                            onClick={() => {
                                router.push(
                                    {
                                        pathname: '/fables',
                                    },
                                    `${process.env.SITE_URL}/fables`,
                                    { shallow: true }
                                )
                            }}
                            _focus={{ outline: 'none' }}
                            _active={{ outline: 'none' }}
                            bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
                            icon={<FaTimes />}
                        />
                    </HStack>
                )}

                {query && !filtered.length && !loading && (
                    <Box height='auto' minHeight='40vh' my='2rem'>
                        <Unavailable
                            message='😧 No posts available for that filter'
                            src='/images/unavailable.svg'
                        />
                    </Box>
                )}

                {loading && <ArticleLoader />}

                {text ? (
                    <Grid gap='2rem' templateColumns='repeat(1, 1fr)'>
                        {filtered &&
                            filtered.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                />
                            ))}
                    </Grid>
                ) : query ? (
                    <Grid gap='2rem' templateColumns='repeat(1, 1fr)'>
                        {filtered &&
                            filtered.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                />
                            ))}
                    </Grid>
                ) : (
                    <Grid gap='2rem' templateColumns='repeat(1, 1fr)'>
                        {articles &&
                            articles.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                />
                            ))}
                    </Grid>
                )}

                {!articles.length && (
                    <Unavailable
                        message='😧 No published fables available'
                        src='/images/unavailable.svg'
                    />
                )}
            </Box>

            <Box
                position='relative'
                width={['100%', '', '', '30%']}
                p={['10px 0', '10px 0', '20px 0']}>
                <Box
                    minHeight='15vh'
                    borderRadius='10px'
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                    mt={['1rem', '2rem', '3rem', '3rem', '6rem']}
                    top={['0', '0', '1rem']}
                    left='0'
                    zIndex='50'
                    p='20px'
                    position='sticky'>
                    <Heading fontSize='md'>Filter by category</Heading>
                    <Divider my='1rem' />
                    <HStack flexWrap='wrap' gap='10px' spacing='0'>
                        <Badge
                            p='10px'
                            fontWeight='400'
                            colorScheme={
                                router.asPath === '/fables' ? 'purple' : 'gray'
                            }
                            textTransform='capitalize'
                            cursor='pointer'
                            onClick={() => {
                                router.push(
                                    {
                                        pathname: '/fables',
                                    },
                                    `${process.env.SITE_URL}/fables`,
                                    { shallow: true }
                                )
                            }}
                            borderRadius='full'>
                            <Text>All Fables</Text>
                        </Badge>

                        {categories &&
                            categories.map((category) => (
                                <Badge
                                    key={category?.id}
                                    p='10px'
                                    fontWeight='500'
                                    cursor='pointer'
                                    colorScheme={
                                        query === category?.name
                                            ? 'purple'
                                            : 'gray'
                                    }
                                    onClick={() => {
                                        gaEvent(
                                            'Fables',
                                            'Filter by category',
                                            category?.name
                                        )
                                        router.push(
                                            {
                                                pathname: '/fables',
                                                query: {
                                                    category: category?.name,
                                                },
                                            },
                                            `/fables?category=${category?.name}`,
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
            </Box>
        </Stack>
    )
}

export default ArticleList
