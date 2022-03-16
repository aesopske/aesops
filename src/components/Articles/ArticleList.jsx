import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import Search from '../common/Search'
import ArticleCard from './ArticleCard'
import { useEffect, useState, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchArticles } from '@/src/utils/requests'

function ArticleList({ articles }) {
    const [searchterm, setSearchterm] = useState('')
    const [filtered, setFiltered] = useState([])

    const [text] = useDebounce(searchterm, 500)

    const fetchFiltered = useCallback(async () => {
        const data = await fetchArticles(text)
        if (data.items) {
            setFiltered(data.items)
        } else {
            setFiltered([])
        }
    }, [text])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (text) {
                fetchFiltered()
            }
        }
    }, [text, fetchFiltered])

    return (
        <Grid
            gap='2rem'
            templateColumns={[
                'repeat(1,1fr)',
                'repeat(1,1fr)',
                'repeat(1,1fr)',
                'repeat(3,1fr)',
            ]}>
            <GridItem colSpan={[1, 1, 1, 2]}>
                <Box height='auto' minHeight='70vh' my='1rem'>
                    <Box my='1rem'>
                        <Search
                            placeholder='Search by title or tag ...'
                            setTerm={setSearchterm}
                            term={searchterm}
                            label='Search Fables'
                        />
                    </Box>

                    <Box height='10vh'>
                        {text && !filtered.length && (
                            <Text my='2rem'>
                                😧 The post you are searching for does not exist
                            </Text>
                        )}
                    </Box>

                    {text ? (
                        <Grid gap='1rem' templateColumns='repeat(1, 1fr)'>
                            {filtered &&
                                filtered.map((article) => (
                                    <ArticleCard
                                        key={article._id}
                                        article={article}
                                    />
                                ))}
                        </Grid>
                    ) : (
                        <Grid gap='1rem' templateColumns='repeat(1, 1fr)'>
                            {articles &&
                                articles.map((article) => (
                                    <ArticleCard
                                        key={article._id}
                                        article={article}
                                    />
                                ))}
                        </Grid>
                    )}
                </Box>
            </GridItem>
            <GridItem></GridItem>
        </Grid>
    )
}

export default ArticleList
