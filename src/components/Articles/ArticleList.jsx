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
} from '@chakra-ui/react'
import Search from '../common/Search'
import ArticleCard from './ArticleCard'
import { useEffect, useState, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchArticles } from '@/src/utils/requests'
import Unavailable from '../common/Unavailable'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaTimes } from 'react-icons/fa'

function ArticleList({ articles, categories }) {
    const router = useRouter()
    const [searchterm, setSearchterm] = useState('')
    const [filtered, setFiltered] = useState([])
    const [text] = useDebounce(searchterm, 500)

    const { category: query } = router.query

    const fetchFiltered = useCallback(async (txt) => {
        const data = await fetchArticles(txt)

        if (data.items) {
            setFiltered(data.items)
        } else {
            setFiltered([])
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
                        my='1rem'>
                        <Heading fontSize='lg' color='gray.500'>
                            Results for {query}
                        </Heading>

                        <Link href={`${process.env.SITE_URL}/fables`} passHref>
                            <IconButton
                                _focus={{ outline: 'none' }}
                                _active={{ outline: 'none' }}
                                bg='gray.300'
                                icon={<FaTimes />}
                            />
                        </Link>
                    </HStack>
                )}

                {query && !filtered.length && (
                    <Box height='auto' minHeight='40vh' my='2rem'>
                        <Unavailable
                            message='😧 No posts available for that filter'
                            src='/images/unavailable.svg'
                        />
                    </Box>
                )}

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
                    bg='white'
                    mt={['1rem', '2rem', '3rem', '3rem', '6rem']}
                    top={['0', '0', '1rem']}
                    left='0'
                    zIndex='50'
                    p='20px'
                    position='sticky'>
                    <Heading fontSize='sm'>Filter by category</Heading>
                    <Divider my='0.5rem' />
                    <HStack flexWrap='wrap' gap='10px' spacing='0'>
                        <Badge
                            p='10px'
                            colorScheme={
                                router.asPath === '/fables' ? 'purple' : 'gray'
                            }
                            textTransform='capitalize'
                            cursor='pointer'
                            borderRadius='full'>
                            <Link
                                href={`${process.env.SITE_URL}/fables`}
                                passHref>
                                <Text>All Fables</Text>
                            </Link>
                        </Badge>

                        {categories &&
                            categories.map((category) => (
                                <Badge
                                    key={category?.id}
                                    p='10px'
                                    cursor='pointer'
                                    colorScheme={
                                        query === category?.name
                                            ? 'purple'
                                            : 'gray'
                                    }
                                    textTransform='capitalize'
                                    borderRadius='full'>
                                    <Link
                                        href={`${process.env.SITE_URL}/fables?category=${category?.name}`}
                                        passHref>
                                        <Text>{category?.name}</Text>
                                    </Link>
                                </Badge>
                            ))}
                    </HStack>
                </Box>
            </Box>
        </Stack>
    )
}

export default ArticleList
