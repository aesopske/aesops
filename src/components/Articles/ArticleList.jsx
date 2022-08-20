import {
    Box,
    Grid,
    Heading,
    HStack,
    IconButton,
    Stack,
    useColorMode,
    useMediaQuery,
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import Search from '../common/Search'
import ArticleCard from './ArticleCard'
import { useEffect, useState, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchArticles, fetchCategories } from '@/src/utils/requests'
import Unavailable from '../common/Unavailable'
import { useRouter } from 'next/router'
import { FaTimes } from 'react-icons/fa'
import ArticleLoader from './ArticleLoader'
import FilterByCategory from './FilterByCategory'
import { MdFilterList } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'

function ArticleList({ articles }) {
    const router = useRouter()
    const { onToggle, isOpen } = useDisclosure()
    const [isTabletAndUp] = useMediaQuery('(min-width: 768px)')
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
            gap='1rem'
            spacing={['2', '2', '3', '8']}
            flexDir={[
                'column-reverse',
                'column-reverse',
                'column-reverse',
                'row',
            ]}>
            <VStack
                spacing='5'
                height='auto'
                minHeight='70vh'
                my='1rem'
                position='relative'
                width={['100%', '', '', '70%']}>
                <HStack
                    height='auto'
                    width='100%'
                    justifyContent='space-between'
                    alignItems='center'>
                    <Box width={['80%', '70%', '70%', '70%', '50%']} p='0'>
                        <Search
                            placeholder='Search by title or tag ...'
                            setTerm={setSearchterm}
                            term={searchterm}
                            label={isTabletAndUp ? 'Search Fables' : ''}
                            full
                        />
                    </Box>
                    <IconButton
                        onClick={onToggle}
                        display={['flex', 'flex', 'flex', 'none']}
                        icon={<MdFilterList />}
                        aria-label='Filter by category'
                        bg='transparent'
                        border='2px solid'
                        borderRadius='10px'
                        borderColor={
                            colorMode === 'light' ? 'gray.300' : 'gray.700'
                        }
                        variant='outline'
                        size='lg'
                        fontSize='xl'
                    />
                </HStack>

                <AnimatePresence>
                    {isOpen && (
                        <Box
                            as={motion.div}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            exit={{ y: 50, opacity: 0 }}>
                            <FilterByCategory
                                categories={categories}
                                query={query}
                            />
                        </Box>
                    )}
                </AnimatePresence>

                <Box height='auto' my='1rem'>
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
                                        pathname: '/articles',
                                    },
                                    `${process.env.SITE_URL}/articles`,
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

                {loading && !filtered.length && <ArticleLoader />}

                {text ? (
                    <Grid gap='3rem' templateColumns='repeat(1, 1fr)'>
                        {filtered &&
                            filtered.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                />
                            ))}
                    </Grid>
                ) : query ? (
                    <Grid gap='3rem' templateColumns='repeat(1, 1fr)'>
                        {filtered &&
                            filtered.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                />
                            ))}
                    </Grid>
                ) : (
                    <Grid gap='3rem' templateColumns='repeat(1, 1fr)'>
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
                        message='😧 No published fables found'
                        src='/images/unavailable.svg'
                    />
                )}
            </VStack>

            <Box
                position='relative'
                display={['none', 'none', 'none', 'block']}
                width={['100%', '', '', '30%']}
                p={['10px 0', '10px 0', '20px 0']}>
                <FilterByCategory categories={categories} query={query} />
            </Box>
        </Stack>
    )
}

export default ArticleList
